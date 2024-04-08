import { App } from 'octokit';

import type Env from './env';
import { generateMessagesForContinuing, generateMessagesForNew } from './messages';
import { GithubPullRequestRepository } from './repository';

export default {
	async fetch(request, env) {
		const req_url = new URL(request.url);

		// Do not respond other than /
		if (req_url.pathname !== '/') {
			return new Response('Not Found', { status: 404 });
		}

		// POST only
		if (request.method !== 'POST') {
			return new Response('Method Not Allowed', { status: 405 });
		}

		// Check if the required headers are set
		const headers = ['X-GitHub-Delivery', 'X-GitHub-Event', 'X-Hub-Signature-256'];
		for (const header of headers) {
			if (!request.headers.has(header)) {
				return new Response('Bad Request', { status: 400 });
			}
		}

		// Create App instance
		const APP_ID = '796157';
		const APP_PRIVKEY = atob(env.GH_APP_PRIVKEY);
		const app = new App({ appId: APP_ID, privateKey: APP_PRIVKEY, webhooks: { secret: env.WEBHOOK_SECRET } });

		app.webhooks.on('pull_request.opened', async ({ octokit, payload }) => {
			const sender = payload.sender.login;
			const prRepository = new GithubPullRequestRepository(octokit, payload.number);

			const status = await prRepository.checkMemberStatus(sender);

			if (status === 'newbie') {
				// 新規入会者向けのタイトルに変更する
				await prRepository.updatePullRequestTitle(`入部届: ${sender}`);
				// 新規入会者向けメッセージを生成してコメントする
				const messages = generateMessagesForNew(payload);
				await prRepository.sendMessages(messages);
			}

			if (status === 'continuing') {
				// 継続者向けのタイトルに変更する
				await prRepository.updatePullRequestTitle(`継続者: ${sender}`);
				// 継続者向けメッセージを生成してコメントする
				const messages = generateMessagesForContinuing(payload);
				await prRepository.sendMessages(messages);
			}
		});

		const payload = await request.text();

		await app.webhooks.verifyAndReceive({
			id: request.headers.get('X-GitHub-Delivery')!,
			name: request.headers.get('X-GitHub-Event')! as any,
			signature: request.headers.get('X-Hub-Signature-256')!,
			payload,
		});

		return new Response('Created', { status: 201 });
	},
} as ExportedHandler<Env>;
