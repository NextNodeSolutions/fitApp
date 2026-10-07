import * as v from 'valibot'

import { SETTINGS_UNAUTHORIZED_MESSAGE } from '../settings/constants'

export const MealEntrySchema = v.object({
	id: v.number(),
	entryDate: v.string(),
	name: v.string(),
	calories: v.number(),
	proteinG: v.number(),
	carbsG: v.number(),
	fatG: v.number(),
	loggedAt: v.number(),
})

export const MealListResponseSchema = v.object({
	entries: v.array(MealEntrySchema),
})

export const MealUnauthorizedResponseSchema = v.object({
	error: v.literal(SETTINGS_UNAUTHORIZED_MESSAGE),
})

export const MealValidationErrorResponseSchema = v.object({
	errors: v.array(v.string()),
})

export type MealEntry = v.InferOutput<typeof MealEntrySchema>
export type MealListResponse = v.InferOutput<typeof MealListResponseSchema>
