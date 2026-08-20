import { INGEST_SOURCE_AI } from '@fitapp/contracts'
import { eq } from 'drizzle-orm'

import { db } from '../../db'
import * as schema from '../../db/schema'

import type { IngestRepository } from '../ports/ingest-repository'

export function createD1IngestRepository(d1: D1Database): IngestRepository {
	const database = db(d1)

	return {
		async findUserIdByApiToken(apiToken: string): Promise<string | null> {
			const [profile] = await database
				.select({ userId: schema.profiles.userId })
				.from(schema.profiles)
				.where(eq(schema.profiles.apiToken, apiToken))
				.limit(1)
			return profile?.userId ?? null
		},
		async insertEntries(ingest): Promise<number> {
			await database.insert(schema.foodEntries).values(
				ingest.items.map(foodItem => ({
					userId: ingest.userId,
					entryDate: ingest.date,
					name: foodItem.name,
					calories: foodItem.calories,
					proteinG: foodItem.protein_g,
					carbsG: foodItem.carbs_g,
					fatG: foodItem.fat_g,
					source: INGEST_SOURCE_AI,
				})),
			)
			return ingest.items.length
		},
	}
}
