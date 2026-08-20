import { Temporal } from '@js-temporal/polyfill'
import { describe, expect, it } from 'vitest'

import { todayIsoDate } from './today-iso-date.ts'

describe('todayIsoDate', () => {
	it('returns today as ISO YYYY-MM-DD from Temporal', () => {
		const today = todayIsoDate()
		expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/)
		expect(today).toBe(Temporal.Now.plainDateISO().toString())
	})
})
