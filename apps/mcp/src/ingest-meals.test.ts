import {
	HTTP_BAD_REQUEST,
	HTTP_OK,
	HTTP_UNAUTHORIZED,
	INGEST_INVALID_BODY_MESSAGE,
} from '@fitapp/contracts'
import { describe, expect, it, vi } from 'vitest'

import { ingestMeals } from './ingest-meals.ts'

import type { IngestBody } from '@fitapp/contracts'
import type { FitAppConfig } from './read-fitapp-config.ts'

const CONFIG = {
	apiToken: 'test-token',
} satisfies FitAppConfig

const BODY: IngestBody = {
	date: '2026-08-20',
	items: [
		{
			name: 'Poulet rôti',
			calories: 250,
			protein_g: 30,
			carbs_g: 0,
			fat_g: 14,
		},
		{
			name: 'Riz',
			calories: 200,
			protein_g: 4,
			carbs_g: 40,
			fat_g: 1,
		},
	],
}

function jsonResponse(payload: unknown, status: number): Response {
	return new Response(JSON.stringify(payload), {
		status,
		headers: { 'Content-Type': 'application/json' },
	})
}

describe('ingestMeals', () => {
	it('posts the meals with a bearer token and reports success', async () => {
		const fetchImpl = vi.fn(async () =>
			jsonResponse({ inserted: 2 }, HTTP_OK),
		)

		await expect(ingestMeals(CONFIG, BODY, fetchImpl)).resolves.toEqual({
			kind: 'success',
		})
		expect(fetchImpl).toHaveBeenCalledWith(
			'https://api-fitapp.nextnode.fr/api/ingest',
			{
				method: 'POST',
				headers: {
					Authorization: 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(BODY),
			},
		)
	})

	it('maps 401 to an invalid-token outcome', async () => {
		const fetchImpl = vi.fn(async () =>
			jsonResponse({ error: 'Invalid API token' }, HTTP_UNAUTHORIZED),
		)

		await expect(ingestMeals(CONFIG, BODY, fetchImpl)).resolves.toEqual({
			kind: 'invalid-token',
		})
	})

	it('maps any other non-OK status to a FitApp error', async () => {
		const fetchImpl = vi.fn(async () =>
			jsonResponse(
				{ error: INGEST_INVALID_BODY_MESSAGE },
				HTTP_BAD_REQUEST,
			),
		)

		await expect(ingestMeals(CONFIG, BODY, fetchImpl)).resolves.toEqual({
			kind: 'fitapp-error',
			status: HTTP_BAD_REQUEST,
			error: INGEST_INVALID_BODY_MESSAGE,
		})
	})

	it('maps a thrown fetch failure to a network outcome', async () => {
		const fetchImpl = vi.fn(async () => {
			throw new TypeError('fetch failed')
		})

		await expect(ingestMeals(CONFIG, BODY, fetchImpl)).resolves.toEqual({
			kind: 'network',
			message: 'fetch failed',
		})
	})
})
