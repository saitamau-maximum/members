import { Octokit } from 'octokit';
import { verify } from '@octokit/webhooks-methods';
import type { PullRequestOpenedEvent } from '@octokit/webhooks-types';

import type Env from './env';

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

		// Check if the header is set
		if (!request.headers.has('X-Hub-Signature-256')) {
			return new Response('Unauthorized', { status: 401 });
		}

		const payload = await request.json<PullRequestOpenedEvent>();

		// Verify signature
		if (!(await verify(env.WEBHOOK_SECRET, JSON.stringify(payload), request.headers.get('X-Hub-Signature-256')!))) {
			return new Response('Unauthorized', { status: 401 });
		}

		// Create Octokit instance
		const octokit = new Octokit({ auth: env.GH_TOKEN });

		return new Response('Accepted', { status: 202 });
	},
};
