import { captureException } from '@sentry/astro'

import { callApiRpc } from '../../lib/call-api-rpc'

import { parseMealListResponse } from './parse-meal-list-response'

import type { MealEntry, MealsRangeQuery } from '@fitapp/contracts'

export async function fetchMealEntries(
	env: Pick<Env, 'API'>,
	userId: string | null,
	range: MealsRangeQuery,
): Promise<MealEntry[]> {
	if (!userId) return []
	try {
		const payload = await callApiRpc(env, 'listMealEntries', userId, range)
		return parseMealListResponse(payload)
	} catch (error) {
		captureException(error)
		return []
	}
}
