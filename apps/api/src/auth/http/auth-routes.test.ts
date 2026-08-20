import {
	AUTH_SIGN_IN_PATH,
	AUTH_SIGN_UP_PATH,
	HTTP_BAD_REQUEST,
} from '@fitapp/contracts'
import { describe, expect, it } from 'vitest'

import { app } from '../../index'

function isD1Database(database: object): database is D1Database {
	return 'prepare' in database && typeof database.prepare === 'function'
}

function createAuthTestEnv(): Env {
	const database = {
		prepare(): never {
			throw new Error('D1 is not available in unit tests')
		},
	}
	if (!isD1Database(database)) {
		throw new Error('Auth tests require a D1-shaped database binding')
	}

	return {
		DB: database,
		BETTER_AUTH_SECRET: 'test-better-auth-secret-32chars!',
		SITE_URL: 'http://localhost:4321',
		D1_DATABASE_ID: 'test-d1',
	}
}

async function postAuth(
	path: string,
	body: Record<string, string>,
): Promise<Response> {
	return app.request(
		path,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		},
		createAuthTestEnv(),
	)
}

describe('Better Auth routes', () => {
	it('handles POST /api/auth/sign-up/email instead of leaving it unmatched', async () => {
		const response = await postAuth(AUTH_SIGN_UP_PATH, {
			name: 'Jean',
			email: 'not-an-email',
			password: 'short',
		})

		expect(response.status).not.toBe(404)
		expect(response.headers.get('set-cookie')).toBeNull()
	})

	it('handles POST /api/auth/sign-in/email instead of leaving it unmatched', async () => {
		const response = await postAuth(AUTH_SIGN_IN_PATH, {
			email: 'not-an-email',
			password: 'short',
		})

		expect(response.status).not.toBe(404)
		expect(response.headers.get('set-cookie')).toBeNull()
	})

	it('rejects sign-up validation errors without claiming a session', async () => {
		const response = await postAuth(AUTH_SIGN_UP_PATH, {
			name: 'Jean',
			email: 'not-an-email',
			password: 'short',
		})

		expect(response.status).toBe(HTTP_BAD_REQUEST)
		expect(response.headers.get('set-cookie')).toBeNull()
		const body: unknown = await response.json()
		expect(body).toEqual(
			expect.objectContaining({
				message: expect.any(String),
			}),
		)
	})

	it('rejects sign-in validation errors without claiming a session', async () => {
		const response = await postAuth(AUTH_SIGN_IN_PATH, {
			email: 'not-an-email',
			password: 'short',
		})

		expect(response.status).toBe(HTTP_BAD_REQUEST)
		expect(response.headers.get('set-cookie')).toBeNull()
		const body: unknown = await response.json()
		expect(body).toEqual(
			expect.objectContaining({
				message: expect.any(String),
			}),
		)
	})

	it('returns the Better Auth response so Set-Cookie headers can survive proxying', async () => {
		const response = await postAuth(AUTH_SIGN_UP_PATH, {
			name: 'Jean',
			email: 'jean@example.com',
			password: 'password1',
		})

		expect(response.status).not.toBe(404)
		expect(
			response.headers.has('set-cookie') || response.status >= 400,
		).toBe(true)
	})
})
