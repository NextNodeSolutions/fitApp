import { describe, expect, it } from 'vitest'

import { fetchFromApi, getApiJson } from './api'
import { ApiError } from './errors/api-error'

const HTTP_SERVER_ERROR = 500

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

describe('fetchFromApi', () => {
	it('forwards the path through the service binding', async () => {
		let received: RequestInfo | URL | undefined
		const env = createEnv(async input => {
			received = input
			return new Response('ok')
		})

		const response = await fetchFromApi(env, '/healthz')

		expect(await response.text()).toBe('ok')
		expect(String(received)).toBe('https://api.internal/healthz')
	})
})

describe('getApiJson', () => {
	it('parses a 2xx response', async () => {
		const env = createEnv(async () => Response.json({ status: 'ok' }))

		await expect(getApiJson(env, '/healthz')).resolves.toEqual({
			status: 'ok',
		})
	})

	it('throws ApiError on a non-2xx response', async () => {
		const env = createEnv(
			async () => new Response('nope', { status: HTTP_SERVER_ERROR }),
		)

		await expect(getApiJson(env, '/healthz')).rejects.toThrow(ApiError)
	})
})
