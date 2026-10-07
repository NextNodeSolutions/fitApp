import { eq } from 'drizzle-orm'

import { db } from '../../db'
import * as schema from '../../db/schema'

import type { AccountRepository } from '../ports/account-repository'

export function createD1SettingsAccountRepository(
	d1: D1Database,
): AccountRepository {
	const database = db(d1)
	return {
		async deleteByUserId(userId: string): Promise<void> {
			const [user] = await database
				.select({ email: schema.user.email })
				.from(schema.user)
				.where(eq(schema.user.id, userId))
				.limit(1)
			if (!user) return
			await database
				.delete(schema.profiles)
				.where(eq(schema.profiles.userId, userId))
			await database
				.delete(schema.verification)
				.where(eq(schema.verification.identifier, user.email))
			await database.delete(schema.user).where(eq(schema.user.id, userId))
		},
	}
}
