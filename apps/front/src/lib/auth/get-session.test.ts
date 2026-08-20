import { describe, expect, it } from 'vitest'

import { getSession } from './get-session'

import type { FrontSession } from './get-session'

const HTTP_UNAUTHORIZED = 401

function createFetcher(
	impl: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
): Fetcher {
	return {
		fetch: impl,
		connect: () => {
			throw new Error('unused')
		},
	}
}

function createEnv(
	fetchImpl: (
		input: RequestInfo | URL,
		init?: RequestInit,
	) => Promise<Response>,
): Pick<Env, 'API'> {
	return { API: createFetcher(fetchImpl) }
}

const SESSION_PAYLOAD: FrontSession = {
	user: {
		id: 'user-1',
		name: 'Jean',
		email: 'jean@example.com',
		emailVerified: false,
	},
	session: {
		id: 'session-1',
		userId: 'user-1',
		expiresAt: '2030-01-01T00:00:00.000Z',
	},
}

describe('getSession', () => {
	it('returns null without calling the api when no cookie is present', async () => {
		let wasCalled = false
		const env = createEnv(async () => {
			wasCalled = true
			return new Response('unused')
		})

		await expect(getSession(env, null)).resolves.toBeNull()
		expect(wasCalled).toBe(false)
	})

	it('forwards the cookie to the get-session endpoint', async () => {
		let received: RequestInfo | URL | undefined
		let receivedCookie: string | null = null
		const env = createEnv(async (input, init) => {
			received = input
			receivedCookie = new Headers(init?.headers).get('cookie')
			return Response.json(SESSION_PAYLOAD)
		})

		const session = await getSession(env, 'better-auth.session_token=abc')

		expect(session).toEqual(SESSION_PAYLOAD)
		expect(String(received)).toBe(
			'https://api.internal/api/auth/get-session',
		)
		expect(receivedCookie).toBe('better-auth.session_token=abc')
	})

	it('returns null on a non-2xx response', async () => {
		const env = createEnv(
			async () => new Response('nope', { status: HTTP_UNAUTHORIZED }),
		)

		await expect(getSession(env, 'cookie')).resolves.toBeNull()
	})

	it('returns null when the payload does not match the schema', async () => {
		const env = createEnv(async () => Response.json({ user: null }))

		await expect(getSession(env, 'cookie')).resolves.toBeNull()
	})

	it('returns null when the api is unreachable', async () => {
		const env = createEnv(async () => {
			throw new Error('network down')
		})

		await expect(getSession(env, 'cookie')).resolves.toBeNull()
	})
})
