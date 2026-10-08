import { calorieStatus } from '@fitapp/contracts'

// Illustrative inputs for the landing demo screens (synthetic, not a real user).
// Every figure shown is derived from them with the real rules from contracts.
export const DEMO_TARGET_KCAL = 2200
export const DEMO_WEIGHT_KG = 70

export const DEMO_LUNCH = {
	time: '12:41',
	prompt: 'Ce midi : une salade de lentilles, un bout de pain et un yaourt nature.',
	items: [
		{ name: 'Salade de lentilles', calories: 320 },
		{ name: 'Pain de campagne', calories: 150 },
		{ name: 'Yaourt nature', calories: 90 },
	],
	macros: { proteinG: 28, carbsG: 77, fatG: 14 },
} as const

export const DEMO_LUNCH_KCAL = DEMO_LUNCH.items.reduce(
	(total, dish) => total + dish.calories,
	0,
)

export const DEMO_DAY = {
	label: 'mer. 7 oct.',
	todayIndex: 2,
	meals: [
		{
			time: '08:12',
			name: 'Skyr, myrtilles, miel',
			calories: 212,
			proteinG: 20,
			carbsG: 30,
			fatG: 4,
		},
		{
			time: DEMO_LUNCH.time,
			name: 'Salade de lentilles, pain…',
			calories: DEMO_LUNCH_KCAL,
			...DEMO_LUNCH.macros,
		},
		{
			time: '19:58',
			name: 'Pâtes au pesto',
			calories: 678,
			proteinG: 34,
			carbsG: 63,
			fatG: 30,
		},
	],
} as const

export const DEMO_WEEK = {
	range: 'du 29/09 au 05/10',
	// Monday to Sunday, 0 when nothing was logged.
	days: [
		{ kcal: 2240 },
		{ kcal: 1980 },
		{ kcal: 2410 },
		{ kcal: 2160 },
		{ kcal: 0 },
		{ kcal: 2210 },
		{ kcal: 2170 },
	],
	weightDeltaKg: -0.6,
	proteinPerDayG: 118,
	proteinDeltaG: 14,
} as const

const loggedDailyKcal = DEMO_WEEK.days
	.map((day): number => day.kcal)
	.filter(kcal => kcal > 0)

export const DEMO_WEEK_STATS = {
	averageKcal: Math.round(
		loggedDailyKcal.reduce((total, kcal) => total + kcal, 0) /
			loggedDailyKcal.length,
	),
	balancedDays: loggedDailyKcal.filter(
		kcal => calorieStatus(kcal, DEMO_TARGET_KCAL) === 'balance',
	).length,
	loggedDays: loggedDailyKcal.length,
}
