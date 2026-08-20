import { eq } from 'drizzle-orm'

import { db } from '../../db'
import * as schema from '../../db/schema'

import type { ApiTokenRepository } from '../ports/api-token-repository'

export function createD1ApiTokenRepository(d1: D1Database): ApiTokenRepository {
	const database = db(d1)
	return {
		async findByUserId(userId: string): Promise<string | null> {
			const [profile] = await database
				.select({ apiToken: schema.profiles.apiToken })
				.from(schema.profiles)
				.where(eq(schema.profiles.userId, userId))
				.limit(1)
			return profile?.apiToken ?? null
		},
	}
}
