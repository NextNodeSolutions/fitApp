import * as v from 'valibot'

import { OnboardingBodySchema } from './body-schema'
import {
	ACTIVITY_LEVEL_VALUES,
	AGE_MAX,
	AGE_MIN,
	HEIGHT_MAX,
	HEIGHT_MIN,
	SEX_VALUES,
	WEIGHT_MAX,
	WEIGHT_MIN,
} from './constants'

import type { OnboardingBody } from './body-schema'

function requiredNumericString(label: string, min: number, max: number) {
	return v.pipe(
		v.string(),
		v.trim(),
		v.check(value => value.length > 0, `${label} est obligatoire`),
		v.check(
			value => !Number.isNaN(Number(value)),
			`${label} doit être un nombre valide`,
		),
		v.check(
			value => Number(value) >= min,
			`${label} doit être entre ${min} et ${max}`,
		),
		v.check(
			value => Number(value) <= max,
			`${label} doit être entre ${min} et ${max}`,
		),
	)
}

function requiredPicklistSchema<Value extends string>(
	label: string,
	options: readonly [Value, ...Value[]],
) {
	return v.pipe(
		v.string(),
		v.trim(),
		v.check(value => value.length > 0, `${label} est obligatoire`),
		v.picklist(options, `${label} est obligatoire`),
	)
}

export const OnboardingFormSchema = v.object({
	height: requiredNumericString('La taille', HEIGHT_MIN, HEIGHT_MAX),
	weight: requiredNumericString('Le poids', WEIGHT_MIN, WEIGHT_MAX),
	age: requiredNumericString("L'âge", AGE_MIN, AGE_MAX),
	sex: requiredPicklistSchema('Le sexe', SEX_VALUES),
	activityLevel: requiredPicklistSchema(
		"Le niveau d'activité",
		ACTIVITY_LEVEL_VALUES,
	),
})

export type OnboardingFormValues = v.InferInput<typeof OnboardingFormSchema>
export type OnboardingFormField = keyof OnboardingFormValues

export function toOnboardingBody(values: OnboardingFormValues): OnboardingBody {
	return v.parse(OnboardingBodySchema, {
		height: Number(values.height),
		weight: Number(values.weight),
		age: Number(values.age),
		sex: values.sex,
		activityLevel: values.activityLevel,
	})
}
