import { fetchFromApi } from '../../lib/api'

import { parseWeightListResponse } from './parse-weight-list-response'

import type { WeightEntry, WeightPeriod } from '@fitapp/contracts'

const WEIGHT_PATH = '/api/weight'

export async function fetchWeightEntries(
	env: Pick<Env, 'API'>,
	cookie: string | null,
	period: WeightPeriod,
): Promise<WeightEntry[]> {
	if (!cookie) return []
	try {
		const response = await fetchFromApi(
			env,
			`${WEIGHT_PATH}?period=${period}`,
			{ headers: { cookie } },
		)
		if (!response.ok) return []
		const payload: unknown = await response.json()
		return parseWeightListResponse(payload)
	} catch {
		return []
	}
}
