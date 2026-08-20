import {
	ConnectionError,
	EmailAlreadyUsedError,
	InvalidServerResponseError,
	AUTH_SIGN_UP_PATH,
} from '@fitapp/contracts'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { submitSignUp } from './submit-sign-up'

const HTTP_BAD_REQUEST = 400

const VALUES = {
	email: 'jean@example.com',
	password: 'mot-de-passe-solide',
	passwordConfirmation: 'mot-de-passe-solide',
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

describe('submitSignUp', () => {
	it('posts the values to the sign-up endpoint', async () => {
		stubFetch(async () => Response.json(SUCCESS_PAYLOAD))

		const outcome = await submitSignUp(VALUES)

		expect(outcome).toEqual({ ok: true })
		expect(vi.mocked(fetch)).toHaveBeenCalledWith(
			AUTH_SIGN_UP_PATH,
			expect.objectContaining({ method: 'POST' }),
		)
	})

	it('maps a duplicate email to EmailAlreadyUsedError', async () => {
		stubFetch(async () =>
			Response.json(
				{ code: 'USER_ALREADY_EXISTS', message: 'User already exists' },
				{ status: HTTP_BAD_REQUEST },
			),
		)

		const outcome = await submitSignUp(VALUES)

		expect(outcome.ok).toBe(false)
		if (!outcome.ok) {
			expect(outcome.error).toBeInstanceOf(EmailAlreadyUsedError)
		}
	})

	it('maps an unexpected success payload to InvalidServerResponseError', async () => {
		stubFetch(async () => Response.json({ unexpected: true }))

		const outcome = await submitSignUp(VALUES)

		expect(outcome.ok).toBe(false)
		if (!outcome.ok) {
			expect(outcome.error).toBeInstanceOf(InvalidServerResponseError)
		}
	})

	it('maps a network failure to ConnectionError', async () => {
		stubFetch(async () => {
			throw new Error('network down')
		})

		const outcome = await submitSignUp(VALUES)

		expect(outcome.ok).toBe(false)
		if (!outcome.ok) {
			expect(outcome.error).toBeInstanceOf(ConnectionError)
		}
	})
})
