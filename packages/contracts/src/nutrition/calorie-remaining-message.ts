import type { CalorieStatus } from './calorie-status'

const KCAL_FORMAT = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 })

export function calorieRemainingMessage(
	status: CalorieStatus,
	consumedKcal: number,
	targetKcal: number,
): string {
	const gapKcal = KCAL_FORMAT.format(Math.abs(targetKcal - consumedKcal))
	if (status === 'surplus') return `${gapKcal} kcal au-dessus de ta cible`
	if (status === 'balance') return 'Pile dans ta cible'
	return `Il te reste ${gapKcal} kcal`
}
