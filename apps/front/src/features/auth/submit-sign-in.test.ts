import {
	AuthenticationError,
	ConnectionError,
	AUTH_SIGN_IN_PATH,
} from '@fitapp/contracts'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { submitSignIn } from './submit-sign-in'

const HTTP_UNAUTHORIZED = 401

const VALUES = {
	email: 'jean@example.com',
	password: 'mot-de-passe-solide',
}

const SUCCESS_PAYLOAD = {
	user: {
		id: 'user-1',
		name: 'Jean Dupont',
		email: 'jean@example.com',
		emailVerified: false,
	},
	token: 'session-token',
}

function stubFetch(impl: () => Promise<Response>): void {
	vi.stubGlobal('fetch', vi.fn(impl))
}

afterEach(() => {
	vi.unstubAllGlobals()
})

describe('submitSignIn', () => {
	it('posts the values to the sign-in endpoint', async () => {
		stubFetch(async () => Response.json(SUCCESS_PAYLOAD))

		const outcome = await submitSignIn(VALUES)

		expect(outcome).toEqual({ ok: true })
		expect(vi.mocked(fetch)).toHaveBeenCalledWith(
			AUTH_SIGN_IN_PATH,
			expect.objectContaining({ method: 'POST' }),
		)
	})

	it('maps invalid credentials to AuthenticationError', async () => {
		stubFetch(async () =>
			Response.json(
				{ code: 'INVALID_EMAIL_OR_PASSWORD', message: 'Invalid' },
				{ status: HTTP_UNAUTHORIZED },
			),
		)

		const outcome = await submitSignIn(VALUES)

		expect(outcome.ok).toBe(false)
		if (!outcome.ok) {
			expect(outcome.error).toBeInstanceOf(AuthenticationError)
		}
	})

	it('maps a network failure to ConnectionError', async () => {
		stubFetch(async () => {
			throw new Error('network down')
		})

		const outcome = await submitSignIn(VALUES)

		expect(outcome.ok).toBe(false)
		if (!outcome.ok) {
			expect(outcome.error).toBeInstanceOf(ConnectionError)
		}
	})
})
