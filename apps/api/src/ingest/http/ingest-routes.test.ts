import {
	HTTP_BAD_REQUEST,
	HTTP_OK,
	HTTP_UNAUTHORIZED,
	INGEST_INVALID_BODY_MESSAGE,
	INGEST_INVALID_TOKEN_MESSAGE,
} from '@fitapp/contracts'
import { describe, expect, it, vi } from 'vitest'

import { createIngestRoutes } from './ingest-routes'

import type { IngestRepository } from '../ports/ingest-repository'

function createRepository(userId: string | null): IngestRepository {
	return {
		findUserIdByApiToken: vi.fn(async () => userId),
		insertEntries: vi.fn(async ingest => ingest.items.length),
	}
}

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

const VALID_BODY = {
	date: '2026-08-20',
	items: [{ name: 'Riz', calories: 200 }],
}

describe('POST /api/ingest', () => {
	it('returns 401 when the bearer token is missing', async () => {
		const routes = createIngestRoutes({
			createRepository: () => createRepository('user-1'),
		})
		const response = await routes.request(
			'/',
			{ method: 'POST' },
			createTestEnv(),
		)

		expect(response.status).toBe(HTTP_UNAUTHORIZED)
		await expect(response.json()).resolves.toEqual({
			error: INGEST_INVALID_TOKEN_MESSAGE,
		})
	})

	it('returns 400 for a body outside the strict schema', async () => {
		const routes = createIngestRoutes({
			createRepository: () => createRepository('user-1'),
		})
		const response = await routes.request(
			'/',
			{
				method: 'POST',
				headers: {
					Authorization: 'Bearer token',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ ...VALID_BODY, extra: true }),
			},
			createTestEnv(),
		)

		expect(response.status).toBe(HTTP_BAD_REQUEST)
		await expect(response.json()).resolves.toEqual({
			error: INGEST_INVALID_BODY_MESSAGE,
		})
	})

	it('returns the ingest error contract for malformed JSON', async () => {
		const routes = createIngestRoutes({
			createRepository: () => createRepository('user-1'),
		})
		const response = await routes.request(
			'/',
			{
				method: 'POST',
				headers: {
					Authorization: 'Bearer token',
					'Content-Type': 'application/json',
				},
				body: '{',
			},
			createTestEnv(),
		)

		expect(response.status).toBe(HTTP_BAD_REQUEST)
		await expect(response.json()).resolves.toEqual({
			error: INGEST_INVALID_BODY_MESSAGE,
		})
	})

	it('returns 401 for an unknown token', async () => {
		const routes = createIngestRoutes({
			createRepository: () => createRepository(null),
		})
		const response = await routes.request(
			'/',
			{
				method: 'POST',
				headers: {
					Authorization: 'Bearer unknown',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(VALID_BODY),
			},
			createTestEnv(),
		)

		expect(response.status).toBe(HTTP_UNAUTHORIZED)
		await expect(response.json()).resolves.toEqual({
			error: INGEST_INVALID_TOKEN_MESSAGE,
		})
	})

	it('returns the inserted item count', async () => {
		const routes = createIngestRoutes({
			createRepository: () => createRepository('user-1'),
		})
		const response = await routes.request(
			'/',
			{
				method: 'POST',
				headers: {
					Authorization: 'Bearer token',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(VALID_BODY),
			},
			createTestEnv(),
		)

		expect(response.status).toBe(HTTP_OK)
		await expect(response.json()).resolves.toEqual({ inserted: 1 })
	})
})
