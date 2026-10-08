import { API_TOKEN_HEX_LENGTH } from '@fitapp/contracts'
import { describe, expect, it } from 'vitest'

import { fetchSettingsToken } from './fetch-settings-token'

const VALID_TOKEN = 'a'.repeat(API_TOKEN_HEX_LENGTH)
const USER_ID = 'user-1'

// A service binding whose RPC method getApiToken is the given implementation.
function createEnv(
	getApiToken: (userId: string) => Promise<unknown>,
): Pick<Env, 'API'> {
	const binding = {
		fetch: () => {
			throw new Error('unused')
		},
		connect: () => {
			throw new Error('unused')
		},
		getApiToken,
	}
	return { API: binding }
}

describe('fetchSettingsToken', () => {
	it('calls the RPC method with the user id and returns the parsed token', async () => {
		let receivedUserId: string | undefined
		const env = createEnv(async userId => {
			receivedUserId = userId
			return { token: VALID_TOKEN }
		})

		const token = await fetchSettingsToken(env, USER_ID)

		expect(token).toBe(VALID_TOKEN)
		expect(receivedUserId).toBe(USER_ID)
	})

	it('returns null without a user', async () => {
		const env = createEnv(async () => ({ token: VALID_TOKEN }))

		await expect(fetchSettingsToken(env, null)).resolves.toBeNull()
	})

	it('returns null when the payload fails validation', async () => {
		const env = createEnv(async () => ({ token: 'bad' }))

		await expect(fetchSettingsToken(env, USER_ID)).resolves.toBeNull()
	})

	it('lets an RPC failure through, so the page can show it', async () => {
		const env = createEnv(async () => {
			throw new Error('binding down')
		})

		await expect(fetchSettingsToken(env, USER_ID)).rejects.toThrow(
			'binding down',
		)
	})
})
