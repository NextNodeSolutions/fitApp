import { Temporal } from '@js-temporal/polyfill'
import { z } from 'zod/v4'

export const logMealInputSchema = z.object({
	date: z.iso.date().default(() => Temporal.Now.plainDateISO().toString()),
	items: z
		.array(
			z.object({
				name: z.string().min(1),
				calories: z.number().nonnegative(),
				protein_g: z.number().nonnegative().optional(),
				carbs_g: z.number().nonnegative().optional(),
				fat_g: z.number().nonnegative().optional(),
			}),
		)
		.min(1),
})

export type LogMealInput = z.infer<typeof logMealInputSchema>
