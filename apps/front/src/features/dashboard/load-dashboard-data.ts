import { weekRangeIso } from '@fitapp/contracts'

import { fetchMealEntries } from '../meals/fetch-meal-entries'
import { fetchSettingsProfile } from '../settings/fetch-settings-profile'
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
	week: IsoDateRange
}

export async function loadDashboardData(
	env: Pick<Env, 'API'>,
	cookie: string | null,
	date: string,
): Promise<DashboardData> {
	const week = weekRangeIso(date)
	const [profile, weekMeals, weights] = await Promise.all([
		fetchSettingsProfile(env, cookie),
		fetchMealEntries(env, cookie, week),
		fetchWeightEntries(env, cookie, DASHBOARD_WEIGHT_PERIOD),
	])
	return { profile, weekMeals, weights, week }
}
