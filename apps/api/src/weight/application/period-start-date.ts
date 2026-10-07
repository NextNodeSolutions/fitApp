import type { WeightPeriod } from '@fitapp/contracts'

const PERIOD_DAYS: Record<WeightPeriod, number> = {
	'30d': 30,
	'90d': 90,
	'365d': 365,
}

const ISO_DATE_LENGTH = 10

export function getPeriodStartDate(period: WeightPeriod): string {
	const startDate = new Date()
	startDate.setUTCDate(startDate.getUTCDate() - PERIOD_DAYS[period])
	return startDate.toISOString().slice(0, ISO_DATE_LENGTH)
}
