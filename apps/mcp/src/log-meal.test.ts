import {
	HTTP_BAD_REQUEST,
	HTTP_OK,
	HTTP_UNAUTHORIZED,
	INGEST_INVALID_BODY_MESSAGE,
} from '@fitapp/contracts'
import { describe, expect, it, vi } from 'vitest'

import { logMealInputSchema } from './log-meal-input-schema.ts'
import { logMeal } from './log-meal.ts'
import { todayIsoDate } from './today-iso-date.ts'

import type { FitAppConfig } from './read-fitapp-config.ts'

const CONFIG = {
	fitappUrl: 'https://api.example.test',
	apiToken: 'test-token',
} satisfies FitAppConfig

const FOODS = [
	{ name: 'Poulet rôti', calories: 250 },
	{ name: 'Riz', calories: 200 },
]

function jsonResponse(payload: unknown, status: number): Response {
	return new Response(JSON.stringify(payload), {
		status,
		headers: { 'Content-Type': 'application/json' },
	})
}

function textOf(
	toolResult: Awaited<ReturnType<typeof logMeal>>,
): string | undefined {
	const [block] = toolResult.content
	if (block?.type === 'text') return block.text
	return undefined
}

describe('logMeal', () => {
	it('defaults a missing date to today', async () => {
		const fetchImpl = vi.fn(async () =>
			jsonResponse({ inserted: 2 }, HTTP_OK),
		)

		const input = logMealInputSchema.parse({ items: FOODS })
		await logMeal(CONFIG, input, fetchImpl)

		expect(fetchImpl).toHaveBeenCalledWith(
			'https://api.example.test/api/ingest',
			expect.objectContaining({
				body: JSON.stringify({
					date: todayIsoDate(),
					items: FOODS.map(food => ({
						...food,
						protein_g: 0,
						carbs_g: 0,
						fat_g: 0,
					})),
				}),
			}),
		)
	})

	it('keeps an explicit ISO date', async () => {
		const fetchImpl = vi.fn(async () =>
			jsonResponse({ inserted: 2 }, HTTP_OK),
		)

		const toolResult = await logMeal(
			CONFIG,
			{ date: '2026-08-20', items: FOODS },
			fetchImpl,
		)

		expect(textOf(toolResult)).toBe(
			'✅ 2 repas enregistrés pour le 2026-08-20 : Poulet rôti (250 kcal), Riz (200 kcal)',
		)
		expect(toolResult.isError).toBeUndefined()
	})

	it('marks token, network and FitApp failures as tool errors', async () => {
		const unauthorized = await logMeal(
			CONFIG,
			{ date: '2026-08-20', items: FOODS },
			vi.fn(async () =>
				jsonResponse({ error: 'nope' }, HTTP_UNAUTHORIZED),
			),
		)
		expect(unauthorized.isError).toBe(true)
		expect(textOf(unauthorized)).toBe('🔒 Jeton API invalide')

		const network = await logMeal(
			CONFIG,
			{ date: '2026-08-20', items: FOODS },
			vi.fn(async () => {
				throw new TypeError('fetch failed')
			}),
		)
		expect(network.isError).toBe(true)
		expect(textOf(network)).toBe('❌ Erreur réseau : fetch failed')

		const fitapp = await logMeal(
			CONFIG,
			{ date: '2026-08-20', items: FOODS },
			vi.fn(async () =>
				jsonResponse(
					{ error: INGEST_INVALID_BODY_MESSAGE },
					HTTP_BAD_REQUEST,
				),
			),
		)
		expect(fitapp.isError).toBe(true)
		expect(textOf(fitapp)).toBe(
			`❌ Erreur FitApp (${HTTP_BAD_REQUEST}) : ${INGEST_INVALID_BODY_MESSAGE}`,
		)
	})
})
