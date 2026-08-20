import { z } from 'zod/v4'

import { todayIsoDate } from './today-iso-date.ts'

export const logMealInputSchema = z.object({
	date: z.iso.date().default(todayIsoDate),
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
