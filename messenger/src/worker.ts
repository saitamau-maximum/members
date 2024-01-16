import { App } from 'octokit';

import type Env from './env';
import generateMessages from './messages';

export default {
	async fetch(request: Request, env: Env, _ctx: any) {
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
			// mainブランチに/members/{sender}.jsonが存在すればスキップ
			try {
				await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
					owner: 'saitamau-maximum',
					repo: 'members',
					path: `members/${sender}.json`,
				});
			} catch (e) {
				// Send messages
				const messages = generateMessages(payload);
				for (const message of messages) {
					await octokit.request('POST /repos/{owner}/{repo}/issues/{issue_number}/comments', {
						owner: 'saitamau-maximum',
						repo: 'members',
						issue_number: payload.number,
						body: message,
					});
				}
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
};
