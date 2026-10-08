import { callApiRpc } from '../../lib/call-api-rpc'

import { parseWeightListResponse } from './parse-weight-list-response'

import type { WeightEntry, WeightPeriod } from '@fitapp/contracts'

export async function fetchWeightEntries(
	env: Pick<Env, 'API'>,
	userId: string | null,
	period: WeightPeriod,
): Promise<WeightEntry[]> {
	if (!userId) return []
	const payload = await callApiRpc(env, 'listWeightEntries', userId, period)
	return parseWeightListResponse(payload)
}
