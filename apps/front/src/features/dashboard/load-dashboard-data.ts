import { weekRangeIso } from '@fitapp/contracts'

import { fetchMealEntries } from '../meals/fetch-meal-entries'
import { fetchSettingsProfile } from '../settings/fetch-settings-profile'
import { fetchLatestWeightEntry } from '../weight/fetch-latest-weight-entry'
import { fetchWeightEntries } from '../weight/fetch-weight-entries'

import type {
	IsoDateRange,
	MealEntry,
	SettingsProfile,
	WeightEntry,
	WeightPeriod,
} from '@fitapp/contracts'

export const DASHBOARD_WEIGHT_PERIOD: WeightPeriod = '30d'

export type DashboardData = {
	profile: SettingsProfile | null
	weekMeals: MealEntry[]
	weights: WeightEntry[]
	latestWeight: WeightEntry | null
	week: IsoDateRange
}

export async function loadDashboardData(
	env: Pick<Env, 'API'>,
	userId: string | null,
	date: string,
): Promise<DashboardData> {
	const week = weekRangeIso(date)
	const [profile, weekMeals, weights, latestWeight] = await Promise.all([
		fetchSettingsProfile(env, userId),
		fetchMealEntries(env, userId, week),
		fetchWeightEntries(env, userId, DASHBOARD_WEIGHT_PERIOD),
		fetchLatestWeightEntry(env, userId),
	])
	return { profile, weekMeals, weights, latestWeight, week }
}
