import { and, desc, eq, gte, sql } from 'drizzle-orm'

import { db } from '../../db'
import * as schema from '../../db/schema'

import type { OwnedWeightEntry, WeightEntry } from '../domain/weight-entry'
import type { WeightRepository } from '../ports/weight-repository'

const WEIGHT_COLUMNS = {
	entryDate: schema.weightEntries.entryDate,
	weightKg: schema.weightEntries.weightKg,
} as const

export function createD1WeightRepository(d1: D1Database): WeightRepository {
	const database = db(d1)
	return {
		async upsertByDate(entry: OwnedWeightEntry): Promise<void> {
			await database
				.insert(schema.weightEntries)
				.values({
					userId: entry.userId,
					entryDate: entry.entryDate,
					weightKg: entry.weightKg,
				})
				.onConflictDoUpdate({
					target: [
						schema.weightEntries.userId,
						schema.weightEntries.entryDate,
					],
					set: {
						weightKg: entry.weightKg,
						createdAt: sql`(unixepoch() * 1000)`,
					},
				})
		},
		async listSince(
			userId: string,
			sinceDate: string,
		): Promise<WeightEntry[]> {
			return database
				.select(WEIGHT_COLUMNS)
				.from(schema.weightEntries)
				.where(
					and(
						eq(schema.weightEntries.userId, userId),
						gte(schema.weightEntries.entryDate, sinceDate),
					),
				)
				.orderBy(desc(schema.weightEntries.entryDate))
		},
		async findLatest(userId: string): Promise<WeightEntry | null> {
			const [latest] = await database
				.select(WEIGHT_COLUMNS)
				.from(schema.weightEntries)
				.where(eq(schema.weightEntries.userId, userId))
				.orderBy(desc(schema.weightEntries.entryDate))
				.limit(1)
			return latest ?? null
		},
	}
}
