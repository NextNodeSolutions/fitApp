import * as v from 'valibot'

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

export type WeightEntry = v.InferOutput<typeof WeightEntrySchema>
export type WeightEntryResponse = v.InferOutput<
	typeof WeightEntryResponseSchema
>
export type WeightListResponse = v.InferOutput<typeof WeightListResponseSchema>
