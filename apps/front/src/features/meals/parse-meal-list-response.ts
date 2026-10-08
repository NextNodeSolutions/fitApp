import { MealListResponseSchema } from '@fitapp/contracts'
import * as v from 'valibot'

import type { MealEntry } from '@fitapp/contracts'

export function parseMealListResponse(payload: unknown): MealEntry[] {
	const parsed = v.safeParse(MealListResponseSchema, payload)
	if (!parsed.success) return []
	return parsed.output.entries
}
