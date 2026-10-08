import { MealsRangeQuerySchema, WeightPeriodSchema } from '@fitapp/contracts'
import * as v from 'valibot'

import { listMealEntries } from '../meals/application/list-meal-entries'
import { getApiToken } from '../settings/application/get-api-token'
import { getSettingsProfile } from '../settings/application/get-settings-profile'
import { getLatestWeightEntry } from '../weight/application/get-latest-weight-entry'
import { listWeightEntries } from '../weight/application/list-weight-entries'
import { getPeriodStartDate } from '../weight/application/period-start-date'

import type { ApiRpc } from '@fitapp/contracts'
import type { MealRepository } from '../meals/ports/meal-repository'
import type { ApiTokenRepository } from '../settings/ports/api-token-repository'
import type { SettingsProfileRepository } from '../settings/ports/settings-profile-repository'
import type { WeightRepository } from '../weight/ports/weight-repository'

export type ApiRpcDeps = {
	createProfileRepository: (db: D1Database) => SettingsProfileRepository
	createApiTokenRepository: (db: D1Database) => ApiTokenRepository
	createWeightRepository: (db: D1Database) => WeightRepository
	createMealRepository: (db: D1Database) => MealRepository
}

// RPC adapter, the binding-only twin of http/: validation, use case, payload.
// The user id comes from the caller, which verified the session.
export function createApiRpc(deps: ApiRpcDeps): (env: Env) => ApiRpc {
	return env => ({
		async getSettingsProfile(userId) {
			const profile = await getSettingsProfile(
				deps.createProfileRepository(env.DB),
				userId,
			)
			if (!profile) return null
			return { profile }
		},
		async getApiToken(userId) {
			const token = await getApiToken(
				deps.createApiTokenRepository(env.DB),
				userId,
			)
			return { token }
		},
		async listWeightEntries(userId, period) {
			const entries = await listWeightEntries(
				deps.createWeightRepository(env.DB),
				userId,
				getPeriodStartDate(v.parse(WeightPeriodSchema, period)),
			)
			return { entries }
		},
		async getLatestWeightEntry(userId) {
			const entry = await getLatestWeightEntry(
				deps.createWeightRepository(env.DB),
				userId,
			)
			if (!entry) return null
			return { entry }
		},
		async listMealEntries(userId, range) {
			const { from, to } = v.parse(MealsRangeQuerySchema, range)
			const entries = await listMealEntries(
				deps.createMealRepository(env.DB),
				userId,
				from,
				to,
			)
			return { entries }
		},
	})
}
