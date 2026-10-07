import * as v from 'valibot'

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

export type MealEntry = v.InferOutput<typeof MealEntrySchema>
export type MealListResponse = v.InferOutput<typeof MealListResponseSchema>
