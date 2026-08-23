import { API_TOKEN_HEX_LENGTH, HTTP_UNAUTHORIZED } from '@fitapp/contracts'
import { describe, expect, it } from 'vitest'

import { fetchSettingsToken } from './fetch-settings-token'

const VALID_TOKEN = 'a'.repeat(API_TOKEN_HEX_LENGTH)

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

describe('fetchSettingsToken', () => {
	it('forwards the cookie and returns the parsed token', async () => {
		let receivedInit: RequestInit | undefined
		const env = createEnv(async (_input, init) => {
			receivedInit = init
			return Response.json({ token: VALID_TOKEN })
		})

		const token = await fetchSettingsToken(env, 'session=abc')

		expect(token).toBe(VALID_TOKEN)
		expect(receivedInit?.headers).toEqual({ cookie: 'session=abc' })
	})

	it('returns null without a cookie', async () => {
		const env = createEnv(async () => Response.json({ token: VALID_TOKEN }))

		await expect(fetchSettingsToken(env, null)).resolves.toBeNull()
	})

	it('returns null on a non-ok response', async () => {
		const env = createEnv(async () =>
			Response.json(
				{ error: 'Unauthorized' },
				{ status: HTTP_UNAUTHORIZED },
			),
		)

		await expect(fetchSettingsToken(env, 'session=abc')).resolves.toBeNull()
	})

	it('returns null when the payload fails validation', async () => {
		const env = createEnv(async () => Response.json({ token: 'bad' }))

		await expect(fetchSettingsToken(env, 'session=abc')).resolves.toBeNull()
	})

	it('returns null when the fetch throws', async () => {
		const env = createEnv(async () => {
			throw new Error('network down')
		})

		await expect(fetchSettingsToken(env, 'session=abc')).resolves.toBeNull()
	})
})
