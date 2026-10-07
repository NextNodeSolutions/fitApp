import { and, asc, between, eq } from 'drizzle-orm'

import { db } from '../../db'
import * as schema from '../../db/schema'

import type { MealEntry } from '../domain/meal-entry'
import type { MealRepository } from '../ports/meal-repository'

const MEAL_COLUMNS = {
	id: schema.foodEntries.id,
	entryDate: schema.foodEntries.entryDate,
	name: schema.foodEntries.name,
	calories: schema.foodEntries.calories,
	proteinG: schema.foodEntries.proteinG,
	carbsG: schema.foodEntries.carbsG,
	fatG: schema.foodEntries.fatG,
	createdAt: schema.foodEntries.createdAt,
} as const

type MealRow = Omit<MealEntry, 'loggedAt'> & { createdAt: Date }

function toMealEntry({ createdAt, ...meal }: MealRow): MealEntry {
	return { ...meal, loggedAt: createdAt.getTime() }
}

export function createD1MealRepository(d1: D1Database): MealRepository {
	const database = db(d1)
	return {
		async listByRange(
			userId: string,
			from: string,
			to: string,
		): Promise<MealEntry[]> {
			const rows = await database
				.select(MEAL_COLUMNS)
				.from(schema.foodEntries)
				.where(
					and(
						eq(schema.foodEntries.userId, userId),
						between(schema.foodEntries.entryDate, from, to),
					),
				)
				.orderBy(
					asc(schema.foodEntries.entryDate),
					asc(schema.foodEntries.createdAt),
					asc(schema.foodEntries.id),
				)
			return rows.map(toMealEntry)
		},
	}
}
