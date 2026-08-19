import { eq } from 'drizzle-orm'

import { db } from '../../db'
import * as schema from '../../db/schema'

import type { Profile } from '../domain/profile'
import type { ProfileRepository } from '../ports/profile-repository'

export function createD1ProfileRepository(d1: D1Database): ProfileRepository {
	const database = db(d1)

	return {
		async save(profile: Profile): Promise<void> {
			await database.insert(schema.profiles).values({
				sessionId: profile.sessionId,
				height: profile.height,
				weight: profile.weight,
				age: profile.age,
				sex: profile.sex,
				activityLevel: profile.activityLevel,
			})
		},
		async findBySessionId(sessionId: string): Promise<Profile | null> {
			const [row] = await database
				.select({
					height: schema.profiles.height,
					weight: schema.profiles.weight,
					age: schema.profiles.age,
					sex: schema.profiles.sex,
					activityLevel: schema.profiles.activityLevel,
				})
				.from(schema.profiles)
				.where(eq(schema.profiles.sessionId, sessionId))
				.limit(1)

			if (!row) return null
			return { sessionId, ...row }
		},
	}
}
