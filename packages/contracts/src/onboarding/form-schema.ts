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
import {
	ACTIVITY_LEVEL_LABEL,
	AGE_LABEL,
	HEIGHT_LABEL,
	rangeMessage,
	SEX_LABEL,
	WEIGHT_LABEL,
} from './messages'

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
		v.check(value => Number(value) >= min, rangeMessage(label, min, max)),
		v.check(value => Number(value) <= max, rangeMessage(label, min, max)),
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
	height: requiredNumericString(HEIGHT_LABEL, HEIGHT_MIN, HEIGHT_MAX),
	weight: requiredNumericString(WEIGHT_LABEL, WEIGHT_MIN, WEIGHT_MAX),
	age: requiredNumericString(AGE_LABEL, AGE_MIN, AGE_MAX),
	sex: requiredPicklistSchema(SEX_LABEL, SEX_VALUES),
	activityLevel: requiredPicklistSchema(
		ACTIVITY_LEVEL_LABEL,
		ACTIVITY_LEVEL_VALUES,
	),
})

export type OnboardingFormValues = v.InferInput<typeof OnboardingFormSchema>
export type OnboardingFormField = keyof OnboardingFormValues

const FORM_FIELDS = [
	'height',
	'weight',
	'age',
	'sex',
	'activityLevel',
] as const satisfies readonly OnboardingFormField[]

export function isOnboardingFormField(
	field: string,
): field is OnboardingFormField {
	return FORM_FIELDS.some(name => name === field)
}

export function getOnboardingFormErrors(
	values: OnboardingFormValues,
): Partial<Record<OnboardingFormField, string>> {
	const result = v.safeParse(OnboardingFormSchema, values)
	if (result.success) return {}
	const errors: Partial<Record<OnboardingFormField, string>> = {}
	for (const issue of result.issues) {
		const key = issue.path?.[0]?.key
		if (typeof key !== 'string') continue
		if (!isOnboardingFormField(key)) continue
		if (errors[key]) continue
		errors[key] = issue.message
	}
	return errors
}

export function toOnboardingBody(values: OnboardingFormValues): OnboardingBody {
	return v.parse(OnboardingBodySchema, {
		height: Number(values.height),
		weight: Number(values.weight),
		age: Number(values.age),
		sex: values.sex,
		activityLevel: values.activityLevel,
	})
}
