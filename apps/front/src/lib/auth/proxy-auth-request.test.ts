import { describe, expect, it } from 'vitest'

import { proxyAuthRequest } from './proxy-auth-request'

const HTTP_UNAUTHORIZED = 401

function createEnv(
	fetchImpl: (
		input: RequestInfo | URL,
		init?: RequestInit,
	) => Promise<Response>,
): Pick<Env, 'API'> {
	return {
		API: {
			fetch: fetchImpl,
			connect: () => {
				throw new Error('unused')
			},
		},
	}
}

describe('proxyAuthRequest', () => {
	it('forwards method, path, query, headers and body to the API', async () => {
		let receivedUrl: string | undefined
		let receivedMethod: string | undefined
		let receivedContentType: string | null = null
		let receivedCookie: string | null = null
		let receivedOrigin: string | null = null
		let receivedBody: string | undefined
		const env = createEnv(async (input, init) => {
			receivedUrl = String(input)
			receivedMethod = init?.method
			const headers = new Headers(init?.headers)
			receivedContentType = headers.get('content-type')
			receivedCookie = headers.get('cookie')
			receivedOrigin = headers.get('origin')
			receivedBody =
				typeof init?.body === 'string' ? init.body : undefined
			return Response.json({ ok: true })
		})
		const request = new Request(
			'https://front.fitapp.dev/api/auth/sign-in/email?remember=true',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					cookie: 'session=abc',
					origin: 'https://front.fitapp.dev',
				},
				body: JSON.stringify({ email: 'jean@example.com' }),
			},
		)

		const response = await proxyAuthRequest(env, request, 'sign-in/email')

		expect(response.status).toBe(200)
		expect(receivedUrl).toBe(
			'https://api.internal/api/auth/sign-in/email?remember=true',
		)
		expect(receivedMethod).toBe('POST')
		expect(receivedContentType).toBe('application/json')
		expect(receivedCookie).toBe('session=abc')
		expect(receivedOrigin).toBe('https://front.fitapp.dev')
		expect(receivedBody).toBe('{"email":"jean@example.com"}')
	})

	it('sends no body for GET requests', async () => {
		let receivedBody: unknown = 'unset'
		const env = createEnv(async (_input, init) => {
			receivedBody = init?.body
			return new Response(null)
		})
		const request = new Request(
			'https://front.fitapp.dev/api/auth/get-session',
		)

		await proxyAuthRequest(env, request, 'get-session')

		expect(receivedBody).toBe(undefined)
	})

	it('preserves the status and every Set-Cookie header', async () => {
		const apiHeaders = new Headers({ 'Content-Type': 'application/json' })
		apiHeaders.append('set-cookie', 'better-auth.session_token=abc; Path=/')
		apiHeaders.append('set-cookie', 'better-auth.session_data=def; Path=/')
		const env = createEnv(
			async () =>
				new Response('{"error":"nope"}', {
					status: HTTP_UNAUTHORIZED,
					headers: apiHeaders,
				}),
		)
		const request = new Request(
			'https://front.fitapp.dev/api/auth/sign-in/email',
			{ method: 'POST', body: '{}' },
		)

		const response = await proxyAuthRequest(env, request, 'sign-in/email')

		expect(response.status).toBe(HTTP_UNAUTHORIZED)
		expect(response.headers.getSetCookie()).toEqual([
			'better-auth.session_token=abc; Path=/',
			'better-auth.session_data=def; Path=/',
		])
		expect(await response.text()).toBe('{"error":"nope"}')
	})
})
