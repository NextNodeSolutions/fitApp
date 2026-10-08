import type { MealEntry } from '../domain/meal-entry'
import type { MealRepository } from '../ports/meal-repository'

export function listMealEntries(
	repository: MealRepository,
	userId: string,
	from: string,
	to: string,
): Promise<MealEntry[]> {
	return repository.listByRange(userId, from, to)
}
