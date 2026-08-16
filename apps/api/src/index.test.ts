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
