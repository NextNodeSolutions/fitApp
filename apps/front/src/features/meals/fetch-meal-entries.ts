import { MEALS_PATH } from '@fitapp/contracts'

import { getApiJson } from '../../lib/api'

import { parseMealListResponse } from './parse-meal-list-response'

import type { MealEntry, MealsRangeQuery } from '@fitapp/contracts'

export async function fetchMealEntries(
	env: Pick<Env, 'API'>,
	cookie: string | null,
	range: MealsRangeQuery,
): Promise<MealEntry[]> {
	if (!cookie) return []
	try {
		const query = new URLSearchParams(range).toString()
		const payload = await getApiJson(env, `${MEALS_PATH}?${query}`, {
			headers: { cookie },
		})
		return parseMealListResponse(payload)
	} catch {
		return []
	}
}
