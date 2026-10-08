export const WEIGHT_PERIODS = ['30d', '90d', '365d'] as const

export type WeightPeriod = (typeof WEIGHT_PERIODS)[number]

export const DEFAULT_WEIGHT_PERIOD: WeightPeriod = '90d'

export const WEIGHT_PERIOD_LABELS: Record<WeightPeriod, string> = {
	'30d': '30 jours',
	'90d': '90 jours',
	'365d': '12 mois',
}

export const WEIGHT_PERIOD_OPTIONS = WEIGHT_PERIODS.map(value => ({
	value,
	label: WEIGHT_PERIOD_LABELS[value],
}))
