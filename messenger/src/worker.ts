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

		return new Response('Hello World!');
	},
};
