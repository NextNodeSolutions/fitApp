export const WEIGHT_PERIODS = ['30d', '90d', '365d'] as const

export type WeightPeriod = (typeof WEIGHT_PERIODS)[number]

export const DEFAULT_WEIGHT_PERIOD: WeightPeriod = '90d'

export const WEIGHT_PERIOD_OPTIONS = [
	{ value: '30d', label: '30 derniers jours' },
	{ value: '90d', label: '90 derniers jours' },
	{ value: '365d', label: '12 derniers mois' },
] as const

export function todayIsoDate(): string {
	return new Date().toISOString().slice(0, 10)
}
