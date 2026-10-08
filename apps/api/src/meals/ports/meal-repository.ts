import type { MealEntry } from '../domain/meal-entry'

export interface MealRepository {
	listByRange(userId: string, from: string, to: string): Promise<MealEntry[]>
}
