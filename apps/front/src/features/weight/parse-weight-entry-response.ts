import { WeightEntryResponseSchema } from '@fitapp/contracts'
import * as v from 'valibot'

import type { WeightEntry } from '@fitapp/contracts'

export function parseWeightEntryResponse(payload: unknown): WeightEntry | null {
	const parsed = v.safeParse(WeightEntryResponseSchema, payload)
	if (!parsed.success) return null
	return parsed.output.entry
}
