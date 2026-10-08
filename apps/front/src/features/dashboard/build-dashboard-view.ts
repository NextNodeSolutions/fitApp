import {
	buildDaySummary,
	computeDailyCalorieTarget,
	weightUnitLabel,
} from '@fitapp/contracts'

import { toDisplayWeightEntries } from '../weight/to-display-weight-entries'

import { buildWeekDays } from './build-week-days'

import type { DaySummary, MealEntry } from '@fitapp/contracts'
import type { DisplayWeightEntry } from '../weight/display-weight-entry'
import type { WeekDay } from './build-week-days'
import type { DashboardData } from './load-dashboard-data'

export type DashboardView = {
	dayMeals: MealEntry[]
	/** null until the profile gives what the targets need. */
	summary: DaySummary | null
	days: WeekDay[]
	weightEntries: DisplayWeightEntry[]
	unitLabel: string
	hasMealsThisWeek: boolean
}

export function buildDashboardView(
	dashboardData: DashboardData,
	date: string,
	today: string,
): DashboardView {
	const { profile, weekMeals, weights, latestWeight, week } = dashboardData
	const dayMeals = weekMeals.filter(meal => meal.entryDate === date)
	// The latest weigh-in, however old, else the weight given at onboarding.
	const weightKg = latestWeight?.weightKg ?? profile?.weight
	const summary =
		profile && weightKg
			? buildDaySummary(
					computeDailyCalorieTarget(profile, weightKg),
					weightKg,
					dayMeals,
				)
			: null
	const units = profile?.units ?? 'metric'
	return {
		dayMeals,
		summary,
		days: buildWeekDays({
			week,
			weekMeals,
			targetKcal: summary?.targetKcal ?? 0,
			selected: date,
			today,
		}),
		weightEntries: toDisplayWeightEntries(weights, units),
		unitLabel: weightUnitLabel(units),
		hasMealsThisWeek: weekMeals.length > 0,
	}
}
