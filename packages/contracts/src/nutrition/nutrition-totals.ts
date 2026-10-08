const GRAMS_ROUNDING_FACTOR = 10

export type NutritionTotals = {
	calories: number
	proteinG: number
	carbsG: number
	fatG: number
}

export type DatedNutrition = NutritionTotals & { entryDate: string }

const EMPTY_TOTALS: NutritionTotals = {
	calories: 0,
	proteinG: 0,
	carbsG: 0,
	fatG: 0,
}

function roundGrams(grams: number): number {
	return Math.round(grams * GRAMS_ROUNDING_FACTOR) / GRAMS_ROUNDING_FACTOR
}

function addNutrition(
	total: NutritionTotals,
	entry: NutritionTotals,
): NutritionTotals {
	return {
		calories: total.calories + entry.calories,
		proteinG: total.proteinG + entry.proteinG,
		carbsG: total.carbsG + entry.carbsG,
		fatG: total.fatG + entry.fatG,
	}
}

export function sumNutrition(
	entries: readonly NutritionTotals[],
): NutritionTotals {
	const total = entries.reduce(addNutrition, EMPTY_TOTALS)
	return {
		calories: Math.round(total.calories),
		proteinG: roundGrams(total.proteinG),
		carbsG: roundGrams(total.carbsG),
		fatG: roundGrams(total.fatG),
	}
}

export function totalsByDay(
	entries: readonly DatedNutrition[],
): Record<string, NutritionTotals> {
	const entriesByDay = Object.groupBy(entries, entry => entry.entryDate)
	return Object.fromEntries(
		Object.entries(entriesByDay).map(([entryDate, dayEntries]) => [
			entryDate,
			sumNutrition(dayEntries ?? []),
		]),
	)
}
