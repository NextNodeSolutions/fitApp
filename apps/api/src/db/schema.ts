import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	email: text('email').notNull().unique(),
	name: text('name'),
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.notNull()
		.default(sql`(unixepoch() * 1000)`),
})

export const profiles = sqliteTable('profiles', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	sessionId: text('session_id').notNull().unique(),
	height: integer('height').notNull(),
	weight: integer('weight').notNull(),
	age: integer('age').notNull(),
	sex: text('sex', { enum: ['male', 'female'] }).notNull(),
	activityLevel: text('activity_level', {
		enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'],
	}).notNull(),
	userId: integer('user_id').references(() => users.id),
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.notNull()
		.default(sql`(unixepoch() * 1000)`),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
		.notNull()
		.default(sql`(unixepoch() * 1000)`),
})
