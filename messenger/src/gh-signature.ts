// https://docs.github.com/ja/webhooks/using-webhooks/validating-webhook-deliveries#javascript-example

const hex2bytes = (hex: string) => {
	const len = hex.length / 2;
	const bytes = new Uint8Array(len);

	for (let i = 0; i < hex.length; i += 2) {
		const c = hex.slice(i, i + 2);
		let b = parseInt(c, 16);
		bytes[i / 2] = b;
	}

	return bytes;
};

const verify_signature = async (req: Request, secret: string) => {
	const encoder = new TextEncoder();

	if (!req.headers.has('X-Hub-Signature-256')) {
		return false;
	}

	const sigHex = req.headers.get('X-Hub-Signature-256')!.split('=')[1];

	const keyBytes = encoder.encode(secret);
	const key = await crypto.subtle.importKey('raw', keyBytes, { name: 'HMAC', hash: { name: 'SHA-256' } }, false, ['sign', 'verify']);

	const sigBytes = hex2bytes(sigHex);
	const bodyBytes = encoder.encode(JSON.stringify(req.body));

	return await crypto.subtle.verify('HMAC', key, sigBytes, bodyBytes);
};

export default verify_signature;
