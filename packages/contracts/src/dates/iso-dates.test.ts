import { describe, expect, it } from 'vitest'

import { addDaysIso, isIsoDate, weekRangeIso } from './index'

describe('iso dates', () => {
	it('returns the Monday to Sunday week of a mid-week date', () => {
		expect(weekRangeIso('2026-10-07')).toEqual({
			from: '2026-10-05',
			to: '2026-10-11',
		})
	})

	it('keeps a Monday and a Sunday inside their own week', () => {
		expect(weekRangeIso('2026-10-05').from).toBe('2026-10-05')
		expect(weekRangeIso('2026-10-11')).toEqual({
			from: '2026-10-05',
			to: '2026-10-11',
		})
	})

	it('crosses month and year boundaries', () => {
		expect(weekRangeIso('2026-01-01')).toEqual({
			from: '2025-12-29',
			to: '2026-01-04',
		})
		expect(addDaysIso('2026-02-28', 1)).toBe('2026-03-01')
	})

	it('accepts only real calendar dates', () => {
		expect(isIsoDate('2026-10-07')).toBe(true)
		expect(isIsoDate('2026-02-31')).toBe(false)
		expect(isIsoDate('2026-1-5')).toBe(false)
		expect(isIsoDate(null)).toBe(false)
	})
})
