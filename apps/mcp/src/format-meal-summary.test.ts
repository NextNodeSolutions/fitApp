import { describe, expect, it } from 'vitest'

import { formatMealSummary } from './format-meal-summary.ts'

describe('formatMealSummary', () => {
	it('uses the singular for one meal', () => {
		expect(
			formatMealSummary('2026-08-20', [
				{ name: 'Yaourt', calories: 120 },
			]),
		).toBe('✅ 1 repas enregistré pour le 2026-08-20 : Yaourt (120 kcal)')
	})

	it('lists every food for the logged date', () => {
		expect(
			formatMealSummary('2026-08-20', [
				{ name: 'Poulet rôti', calories: 250 },
				{ name: 'Riz', calories: 200 },
			]),
		).toBe(
			'✅ 2 repas enregistrés pour le 2026-08-20 : Poulet rôti (250 kcal), Riz (200 kcal)',
		)
	})
})
