const ISO_DATE_LENGTH = 10

export const DAYS_PER_WEEK = 7

export type IsoDateRange = { from: string; to: string }

/** Reads an ISO `YYYY-MM-DD` date as midnight UTC of that calendar day. */
export function parseIsoDate(isoDate: string): Date {
	return new Date(`${isoDate}T00:00:00.000Z`)
}

export function formatIsoDate(date: Date): string {
	return date.toISOString().slice(0, ISO_DATE_LENGTH)
}

export function todayIsoDate(): string {
	return formatIsoDate(new Date())
}

// Round-trip check: rejects malformed strings and impossible days (2026-02-31).
export function isIsoDate(candidate: unknown): candidate is string {
	if (typeof candidate !== 'string') return false
	const date = parseIsoDate(candidate)
	return !Number.isNaN(date.getTime()) && formatIsoDate(date) === candidate
}

export function addDaysIso(isoDate: string, days: number): string {
	const date = parseIsoDate(isoDate)
	date.setUTCDate(date.getUTCDate() + days)
	return formatIsoDate(date)
}

export function weekRangeIso(isoDate: string): IsoDateRange {
	const daysSinceMonday =
		(parseIsoDate(isoDate).getUTCDay() + DAYS_PER_WEEK - 1) % DAYS_PER_WEEK
	const from = addDaysIso(isoDate, -daysSinceMonday)
	return { from, to: addDaysIso(from, DAYS_PER_WEEK - 1) }
}
