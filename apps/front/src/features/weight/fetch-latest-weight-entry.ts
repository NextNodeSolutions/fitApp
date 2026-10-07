import { callApiRpc } from '../../lib/call-api-rpc'

import { parseWeightEntryResponse } from './parse-weight-entry-response'

import type { WeightEntry } from '@fitapp/contracts'

export async function fetchLatestWeightEntry(
	env: Pick<Env, 'API'>,
	userId: string | null,
): Promise<WeightEntry | null> {
	if (!userId) return null
	const payload = await callApiRpc(env, 'getLatestWeightEntry', userId)
	return parseWeightEntryResponse(payload)
}
