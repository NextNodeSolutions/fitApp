import { eq, sql } from 'drizzle-orm'

import { db } from '../../db'
import * as schema from '../../db/schema'

import type { SettingsProfileRepository } from '../ports/settings-profile-repository'

const PROFILE_COLUMNS = {
	height: schema.profiles.height,
	weight: schema.profiles.weight,
	age: schema.profiles.age,
	sex: schema.profiles.sex,
	activityLevel: schema.profiles.activityLevel,
	units: schema.profiles.units,
} as const

export function createD1SettingsProfileRepository(
	d1: D1Database,
): SettingsProfileRepository {
	const database = db(d1)
	return {
		async findByUserId(userId: string) {
			const [profile] = await database
				.select(PROFILE_COLUMNS)
				.from(schema.profiles)
				.where(eq(schema.profiles.userId, userId))
				.limit(1)
			return profile ?? null
		},
		async updateByUserId(userId: string, patch) {
			const [profile] = await database
				.update(schema.profiles)
				.set({ ...patch, updatedAt: sql`(unixepoch() * 1000)` })
				.where(eq(schema.profiles.userId, userId))
				.returning(PROFILE_COLUMNS)
			return profile ?? null
		},
	}
}
