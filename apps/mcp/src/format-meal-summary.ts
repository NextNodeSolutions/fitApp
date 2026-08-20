const SINGLE_MEAL_COUNT = 1

export function formatMealSummary(
	date: string,
	foods: readonly { name: string; calories: number }[],
): string {
	const listedFoods = foods
		.map(food => `${food.name} (${food.calories} kcal)`)
		.join(', ')
	const pastParticiple =
		foods.length === SINGLE_MEAL_COUNT ? 'enregistré' : 'enregistrés'
	return `✅ ${foods.length} repas ${pastParticiple} pour le ${date} : ${listedFoods}`
}
