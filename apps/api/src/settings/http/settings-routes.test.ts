import {
	HTTP_OK,
	HTTP_UNAUTHORIZED,
	SETTINGS_UNAUTHORIZED_MESSAGE,
} from '@fitapp/contracts'
import { describe, expect, it, vi } from 'vitest'

import { createSettingsRoutes } from './settings-routes'

import type { ApiTokenRepository } from '../ports/api-token-repository'

function isD1Database(database: object): database is D1Database {
	return 'prepare' in database && typeof database.prepare === 'function'
}

function createTestEnv(): Env {
	const database = { prepare: vi.fn() }
	if (!isD1Database(database)) throw new Error('D1 binding required')
	return {
		DB: database,
		BETTER_AUTH_SECRET: 'test-better-auth-secret-32chars!',
		SITE_URL: 'http://localhost:8787',
		D1_DATABASE_ID: 'test-d1',
	}
}

function createRepository(token: string | null): ApiTokenRepository {
	return { findByUserId: vi.fn(async () => token) }
}

describe('GET /api/settings/token', () => {
	it('returns 401 without an authenticated user', async () => {
		const routes = createSettingsRoutes({
			createRepository: () => createRepository(null),
			getUserId: vi.fn(async () => null),
		})

		const response = await routes.request('/token', {}, createTestEnv())

		expect(response.status).toBe(HTTP_UNAUTHORIZED)
		await expect(response.json()).resolves.toEqual({
			error: SETTINGS_UNAUTHORIZED_MESSAGE,
		})
	})

	it('returns the current user API token', async () => {
		const token = 'a'.repeat(32)
		const repository = createRepository(token)
		const routes = createSettingsRoutes({
			createRepository: () => repository,
			getUserId: vi.fn(async () => 'user-1'),
		})

		const response = await routes.request('/token', {}, createTestEnv())

		expect(response.status).toBe(HTTP_OK)
		await expect(response.json()).resolves.toEqual({ token })
		expect(repository.findByUserId).toHaveBeenCalledWith('user-1')
	})
})
