import { calorieRemainingMessage } from './calorie-remaining-message'
import { calorieStatus } from './calorie-status'
import { MACRO_SPECS, macroRemainingMessage } from './macro-specs'
import { computeMacroTargets } from './macro-targets'
import { sumNutrition } from './nutrition-totals'

import type { CalorieStatus } from './calorie-status'
import type { MacroKey } from './macro-specs'
import type { NutritionTotals } from './nutrition-totals'

export type MacroProgress = {
	key: MacroKey
	label: string
	consumedG: number
	targetG: number
	message: string | null
}

export type DaySummary = {
	targetKcal: number
	consumed: NutritionTotals
	status: CalorieStatus
	remainingMessage: string
	macros: MacroProgress[]
}

/** Where a day stands against the calorie target and the macro targets. */
export function buildDaySummary(
	targetKcal: number,
	weightKg: number,
	dayEntries: readonly NutritionTotals[],
): DaySummary {
	const consumed = sumNutrition(dayEntries)
	const status = calorieStatus(consumed.calories, targetKcal)
	const targets = computeMacroTargets(targetKcal, weightKg)
	return {
		targetKcal,
		consumed,
		status,
		remainingMessage: calorieRemainingMessage(
			status,
			consumed.calories,
			targetKcal,
		),
		macros: MACRO_SPECS.map(spec => ({
			key: spec.key,
			label: spec.label,
			consumedG: consumed[spec.key],
			targetG: targets[spec.key],
			message: macroRemainingMessage(
				spec.label,
				consumed[spec.key],
				targets[spec.key],
			),
		})),
	}
}
