import { CALORIE_BALANCE_TOLERANCE_KCAL } from './constants'

export const CALORIE_STATUS_VALUES = ['deficit', 'balance', 'surplus'] as const

export type CalorieStatus = (typeof CALORIE_STATUS_VALUES)[number]

export const CALORIE_STATUS_LABELS: Record<CalorieStatus, string> = {
	deficit: 'En déficit',
	balance: "À l'équilibre",
	surplus: 'En surplus',
}

export function calorieStatus(
	consumedKcal: number,
	targetKcal: number,
): CalorieStatus {
	if (consumedKcal < targetKcal - CALORIE_BALANCE_TOLERANCE_KCAL) {
		return 'deficit'
	}
	if (consumedKcal > targetKcal + CALORIE_BALANCE_TOLERANCE_KCAL) {
		return 'surplus'
	}
	return 'balance'
}
