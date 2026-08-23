import { afterEach, describe, expect, it, vi } from 'vitest'

import { logMealInputSchema } from './log-meal-input-schema.ts'

const FOOD = { name: 'Riz', calories: 200 }

afterEach(() => {
	vi.useRealTimers()
})

describe('logMealInputSchema', () => {
	it('computes the default date for every parse', () => {
		vi.useFakeTimers()
		vi.setSystemTime('2026-08-20T12:00:00Z')
		expect(logMealInputSchema.parse({ items: [FOOD] }).date).toBe(
			'2026-08-20',
		)

		vi.setSystemTime('2026-08-21T12:00:00Z')
		expect(logMealInputSchema.parse({ items: [FOOD] }).date).toBe(
			'2026-08-21',
		)
	})

	it('rejects invalid dates and empty meals', () => {
		expect(
			logMealInputSchema.safeParse({ date: '20-08-2026', items: [FOOD] })
				.success,
		).toBe(false)
		expect(logMealInputSchema.safeParse({ items: [] }).success).toBe(false)
	})
})
