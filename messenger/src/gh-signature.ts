import { Buffer } from 'node:buffer';
import node_crypto from 'node:crypto';

// https://docs.github.com/ja/webhooks/using-webhooks/validating-webhook-deliveries#typescript-example
const verify_signature = (req: Request, secret: string) => {
	const signature = node_crypto.createHmac('sha256', secret).update(JSON.stringify(req.body)).digest('hex');

	let trusted = Buffer.from(`sha256=${signature}`, 'ascii');
	let untrusted = Buffer.from(req.headers.get('X-Hub-Signature-256'), 'ascii');

	return node_crypto.timingSafeEqual(trusted, untrusted);
};

export default verify_signature;
