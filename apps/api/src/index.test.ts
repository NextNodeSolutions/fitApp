import {
	AUTH_BASE_PATH,
	AUTH_SIGN_UP_PATH,
	HTTP_BAD_REQUEST,
} from '@fitapp/contracts'
import { describe, expect, it } from 'vitest'

import { app } from './index'

const AUTH_OPENAPI_PATH = `${AUTH_BASE_PATH}/open-api/generate-schema`

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

describe('GET /docs', () => {
	it('returns Scalar HTML with application and auth sources', async () => {
		const response = await app.request('/docs')

		expect(response.status).toBe(200)
		expect(response.headers.get('content-type')).toMatch(/html/)
		const html = await response.text()
		expect(html.toLowerCase()).toContain('scalar')
		expect(html).toContain('/openapi.json')
		expect(html).toContain(AUTH_OPENAPI_PATH)
	})
})

describe('GET /openapi.json', () => {
	it('is OpenAPI 3.1 and documents every non-auth contract', async () => {
		const response = await app.request('/openapi.json')

		expect(response.status).toBe(200)
		const specification = await response.text()
		expect(specification).not.toContain('"/api/auth')
		expect(JSON.parse(specification)).toMatchObject({
			openapi: expect.stringMatching(/^3\.1/),
			components: {
				securitySchemes: {
					bearerAuth: { type: 'http', scheme: 'bearer' },
					cookieAuth: { type: 'apiKey', in: 'cookie' },
				},
			},
			paths: {
				'/healthz': {
					get: {
						tags: ['Health'],
						responses: { 200: expect.any(Object) },
					},
				},
				'/api/onboarding': {
					post: {
						requestBody: expect.any(Object),
						responses: {
							201: expect.any(Object),
							400: expect.any(Object),
							401: expect.any(Object),
						},
						security: [{ cookieAuth: [] }],
					},
				},
				'/api/onboarding/{sessionId}': {
					get: {
						parameters: expect.any(Array),
						responses: {
							200: expect.any(Object),
							404: expect.any(Object),
						},
					},
				},
				'/api/ingest': {
					post: {
						requestBody: expect.any(Object),
						responses: {
							200: expect.any(Object),
							400: expect.any(Object),
							401: expect.any(Object),
						},
						security: [{ bearerAuth: [] }],
					},
				},
				'/api/settings/token': {
					get: {
						responses: {
							200: expect.any(Object),
							401: expect.any(Object),
						},
						security: [{ cookieAuth: [] }],
					},
				},
			},
		})
	})
})

describe(`GET ${AUTH_OPENAPI_PATH}`, () => {
	it('returns the Better Auth OpenAPI document', async () => {
		const response = await app.request(
			AUTH_OPENAPI_PATH,
			{ method: 'GET' },
			createAuthTestEnv(),
		)

		expect(response.status).toBe(200)
		expect(await response.json()).toMatchObject({
			openapi: expect.stringMatching(/^3\.1/),
		})
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
