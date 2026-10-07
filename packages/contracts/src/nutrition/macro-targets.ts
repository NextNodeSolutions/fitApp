import { FAT_G_PER_KG, KCAL_PER_GRAM, PROTEIN_G_PER_KG } from './constants'

import type { NutritionTotals } from './nutrition-totals'

export type MacroTargets = Omit<NutritionTotals, 'calories'>

export function computeMacroTargets(
	calorieTarget: number,
	weightKg: number,
): MacroTargets {
	const proteinG = weightKg * PROTEIN_G_PER_KG
	const fatG = weightKg * FAT_G_PER_KG
	const carbsKcal =
		calorieTarget -
		proteinG * KCAL_PER_GRAM.protein -
		fatG * KCAL_PER_GRAM.fat
	return {
		proteinG: Math.round(proteinG),
		carbsG: Math.round(Math.max(0, carbsKcal / KCAL_PER_GRAM.carbs)),
		fatG: Math.round(fatG),
	}
}
