import { FAT_G_PER_KG, KCAL_PER_GRAM, PROTEIN_G_PER_KG } from './constants'

import type { NutritionTotals } from './nutrition-totals'

export type MacroTargets = Omit<NutritionTotals, 'calories'>

export function computeMacroTargets(
	calorieTarget: number,
	weightKg: number,
): MacroTargets {
	// Every goal must fit in the calorie target, even for a very small one:
	// protein first, then fat with what is left, carbs take the remainder.
	const proteinG = Math.min(
		weightKg * PROTEIN_G_PER_KG,
		calorieTarget / KCAL_PER_GRAM.protein,
	)
	const kcalAfterProtein = calorieTarget - proteinG * KCAL_PER_GRAM.protein
	const fatG = Math.min(
		weightKg * FAT_G_PER_KG,
		kcalAfterProtein / KCAL_PER_GRAM.fat,
	)
	const carbsKcal = kcalAfterProtein - fatG * KCAL_PER_GRAM.fat
	return {
		proteinG: Math.round(proteinG),
		carbsG: Math.round(Math.max(0, carbsKcal / KCAL_PER_GRAM.carbs)),
		fatG: Math.round(Math.max(0, fatG)),
	}
}
