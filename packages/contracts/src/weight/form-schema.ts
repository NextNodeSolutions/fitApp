import * as v from 'valibot'

import { todayIsoDate } from '../dates/iso-dates'
import { requiredNumericString } from '../onboarding/form-schema'

import { WeightEntryBodySchema } from './body-schema'
import { weightDisplayRange, weightKilogramsFromDisplay } from './units'

import type { Units } from '../settings/units'
import type { WeightEntryBody } from './body-schema'

export function toWeightEntryFormSchema(units: Units) {
	const weightRange = weightDisplayRange(units)
	return v.object({
		entryDate: v.pipe(
			v.string(),
			v.trim(),
			v.check(
				value => value.length > 0,
				'La date de pesée est obligatoire',
			),
			v.check(
				value => !Number.isNaN(Date.parse(value)),
				'La date de pesée est invalide',
			),
			v.check(
				value => value <= todayIsoDate(),
				'La date de pesée ne peut pas être dans le futur',
			),
		),
		weight: requiredNumericString(
			'Le poids',
			weightRange.min,
			weightRange.max,
		),
	})
}

export type WeightEntryFormValues = v.InferInput<
	ReturnType<typeof toWeightEntryFormSchema>
>

export function toWeightEntryBody(
	values: WeightEntryFormValues,
	units: Units,
): WeightEntryBody {
	return v.parse(WeightEntryBodySchema, {
		entryDate: values.entryDate,
		weight: weightKilogramsFromDisplay(Number(values.weight), units),
	})
}
