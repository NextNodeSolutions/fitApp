import { describe, expect, it } from 'vitest'

import { app } from './index'

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

		expect(response.status).toBe(400)
		const body: { errors: string[] } = await response.json()
		expect(body.errors).toBeDefined()
	})

	it('rejects missing fields', async () => {
		const response = await app.request('/api/onboarding', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ height: 175 }),
		})

		expect(response.status).toBe(400)
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

		expect(response.status).toBe(400)
	})
})
