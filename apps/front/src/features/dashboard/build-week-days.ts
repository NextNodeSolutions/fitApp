import { addDaysIso, calorieStatus, totalsByDay } from '@fitapp/contracts'

import { WEEKDAY_LETTERS } from '../../lib/weekday-letters'

import { dashboardHref } from './dashboard-href'

import type { CalorieStatus, IsoDateRange, MealEntry } from '@fitapp/contracts'

const DAY_OF_MONTH_START = 8

export type WeekDay = {
	isoDate: string
	letter: string
	dayOfMonth: number
	href: string
	kcal: number
	share: number
	state: CalorieStatus | 'empty' | 'future'
	isSelected: boolean
	isToday: boolean
}

type WeekContext = {
	week: IsoDateRange
	weekMeals: readonly MealEntry[]
	targetKcal: number
	selected: string
	today: string
}

export function buildWeekDays(context: WeekContext): WeekDay[] {
	const totals = totalsByDay(context.weekMeals)
	return WEEKDAY_LETTERS.map((letter, index) => {
		const isoDate = addDaysIso(context.week.from, index)
		const kcal = totals[isoDate]?.calories ?? 0
		const isFuture = isoDate > context.today
		return {
			isoDate,
			letter,
			dayOfMonth: Number(isoDate.slice(DAY_OF_MONTH_START)),
			href: dashboardHref(isoDate, context.today),
			kcal,
			share: context.targetKcal > 0 ? kcal / context.targetKcal : 0,
			state: isFuture
				? 'future'
				: kcal === 0
					? 'empty'
					: calorieStatus(kcal, context.targetKcal),
			isSelected: isoDate === context.selected,
			isToday: isoDate === context.today,
		}
	})
}
