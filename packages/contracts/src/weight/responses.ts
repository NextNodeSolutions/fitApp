import * as v from 'valibot'

import { SETTINGS_UNAUTHORIZED_MESSAGE } from '../settings/constants'

export const WeightEntrySchema = v.object({
	entryDate: v.string(),
	weightKg: v.number(),
})

export const WeightEntryResponseSchema = v.object({
	entry: WeightEntrySchema,
})

export const WeightListResponseSchema = v.object({
	entries: v.array(WeightEntrySchema),
})

export const WeightUnauthorizedResponseSchema = v.object({
	error: v.literal(SETTINGS_UNAUTHORIZED_MESSAGE),
})

export const WeightValidationErrorResponseSchema = v.object({
	errors: v.array(v.string()),
})

export type WeightEntry = v.InferOutput<typeof WeightEntrySchema>
export type WeightEntryResponse = v.InferOutput<
	typeof WeightEntryResponseSchema
>
export type WeightListResponse = v.InferOutput<typeof WeightListResponseSchema>
