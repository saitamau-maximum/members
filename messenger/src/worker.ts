import type Env from './env';
import { verify } from '@octokit/webhooks-methods';

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

		const body = await request.text();

		// Verify signature
		if (!(await verify(env.WEBHOOK_SECRET, body, request.headers.get('X-Hub-Signature-256')!))) {
			return new Response('Unauthorized', { status: 401 });
		}

		return new Response('Hello World!');
	},
};
