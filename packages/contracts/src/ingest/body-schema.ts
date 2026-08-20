import * as v from 'valibot'

const optionalMacroSchema = v.optional(v.pipe(v.number(), v.minValue(0)), 0)

export const IngestItemSchema = v.strictObject({
	name: v.pipe(v.string(), v.minLength(1)),
	calories: v.pipe(v.number(), v.minValue(0)),
	protein_g: optionalMacroSchema,
	carbs_g: optionalMacroSchema,
	fat_g: optionalMacroSchema,
})

export const IngestBodySchema = v.strictObject({
	date: v.pipe(v.string(), v.isoDate()),
	items: v.pipe(v.array(IngestItemSchema), v.minLength(1)),
})

export type IngestItem = v.InferOutput<typeof IngestItemSchema>
export type IngestBody = v.InferOutput<typeof IngestBodySchema>
