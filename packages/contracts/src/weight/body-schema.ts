import * as v from 'valibot'

import { WeightFieldSchema } from '../onboarding/body-schema'

import { todayIsoDate } from './constants'

export const WeightEntryBodySchema = v.object({
	entryDate: v.pipe(
		v.string('La date de pesée est obligatoire'),
		v.isoDate('La date de pesée est invalide'),
		v.check(
			value => value <= todayIsoDate(),
			'La date de pesée ne peut pas être dans le futur',
		),
	),
	weight: WeightFieldSchema,
})

export type WeightEntryBody = v.InferOutput<typeof WeightEntryBodySchema>
