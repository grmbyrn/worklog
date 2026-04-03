import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Ensure TextEncoder/TextDecoder exist before any runtime shims
(global as unknown as { TextEncoder: typeof TextEncoder }).TextEncoder = TextEncoder;
(global as unknown as { TextDecoder: typeof TextDecoder }).TextDecoder = TextDecoder;

// Minimal Request polyfill for Node/Jest environment used by API route tests
// The real Request has more behavior; this provides `json()` and stores body/method.
class TestRequest {
	url: string;
	method?: string;
	headers?: Record<string, string>;
	private _body?: string | undefined;
	constructor(url: string, init?: { method?: string; headers?: Record<string, string>; body?: string | undefined }) {
		this.url = url;
		this.method = init?.method;
		this.headers = init?.headers;
		this._body = init?.body;
	}
	async json() {
		if (this._body === undefined) return null;
		return JSON.parse(this._body);
	}
	text() {
		return Promise.resolve(this._body ?? '');
	}
}

(global as unknown as { Request?: unknown }).Request = TestRequest;

// Basic env required by validateEnv and next-auth during tests
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/test';
process.env.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || 'test-secret';
process.env.NEXTAUTH_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

// Minimal Response.json helper used by Next.js app route handlers in tests
// Provide a minimal Response-like object used by app route handlers in tests
class TestResponse {
	body: unknown;
	status?: number;
	ok: boolean;
	constructor(body: unknown, init?: { status?: number }) {
		this.body = body;
		this.status = init?.status;
		this.ok = this.status === undefined ? true : this.status >= 200 && this.status < 300;
	}
	async json() {
		return this.body;
	}
}

if ((global as unknown as { Response?: unknown }).Response === undefined) {
	(global as unknown as { Response?: unknown }).Response = {
		json(body: unknown, init?: { status?: number }) {
			return new TestResponse(body, init);
		},
	};
}

// Only assign TestRequest if a global Request is not already present
if ((global as unknown as { Request?: unknown }).Request === undefined) {
	(global as unknown as { Request?: unknown }).Request = TestRequest;
}