import { AUTH_SIGN_UP_PATH, HTTP_BAD_REQUEST } from '@fitapp/contracts'
import { describe, expect, it } from 'vitest'

import { app } from './index'

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

describe('GET /healthz', () => {
	it('returns 200 with service info', async () => {
		const response = await app.request('/healthz')

		expect(response.status).toBe(200)
		await expect(response.json()).resolves.toEqual({
			status: 'ok',
			service: 'api',
		})
	})
})

describe('POST /api/auth/sign-up/email', () => {
	it('is handled by the mounted Better Auth adapter', async () => {
		const response = await app.request(
			AUTH_SIGN_UP_PATH,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: 'Jean',
					email: 'not-an-email',
					password: 'short',
				}),
			},
			createAuthTestEnv(),
		)

		expect(response.status).not.toBe(404)
	})
})

describe('POST /api/onboarding', () => {
	it('rejects invalid height', async () => {
		const response = await app.request('/api/onboarding', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				height: 50,
				weight: 72,
				age: 28,
				sex: 'male',
				activityLevel: 'moderate',
			}),
		})

		expect(response.status).toBe(HTTP_BAD_REQUEST)
		const body: { errors: string[] } = await response.json()
		expect(body.errors).toBeDefined()
	})

	it('rejects missing fields', async () => {
		const response = await app.request('/api/onboarding', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ height: 175 }),
		})

		expect(response.status).toBe(HTTP_BAD_REQUEST)
	})

	it('rejects invalid sex value', async () => {
		const response = await app.request('/api/onboarding', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				height: 175,
				weight: 72,
				age: 28,
				sex: 'other',
				activityLevel: 'moderate',
			}),
		})

		expect(response.status).toBe(HTTP_BAD_REQUEST)
	})
})
