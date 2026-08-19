import * as v from 'valibot'

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

export const OnboardingBodySchema = v.object({
	height: v.pipe(
		v.number(`${HEIGHT_LABEL} doit être un nombre valide`),
		v.minValue(
			HEIGHT_MIN,
			rangeMessage(HEIGHT_LABEL, HEIGHT_MIN, HEIGHT_MAX),
		),
		v.maxValue(
			HEIGHT_MAX,
			rangeMessage(HEIGHT_LABEL, HEIGHT_MIN, HEIGHT_MAX),
		),
	),
	weight: v.pipe(
		v.number(`${WEIGHT_LABEL} doit être un nombre valide`),
		v.minValue(
			WEIGHT_MIN,
			rangeMessage(WEIGHT_LABEL, WEIGHT_MIN, WEIGHT_MAX),
		),
		v.maxValue(
			WEIGHT_MAX,
			rangeMessage(WEIGHT_LABEL, WEIGHT_MIN, WEIGHT_MAX),
		),
	),
	age: v.pipe(
		v.number(`${AGE_LABEL} doit être un nombre valide`),
		v.minValue(AGE_MIN, rangeMessage(AGE_LABEL, AGE_MIN, AGE_MAX)),
		v.maxValue(AGE_MAX, rangeMessage(AGE_LABEL, AGE_MIN, AGE_MAX)),
	),
	sex: v.picklist(SEX_VALUES, `${SEX_LABEL} est obligatoire`),
	activityLevel: v.picklist(
		ACTIVITY_LEVEL_VALUES,
		`${ACTIVITY_LEVEL_LABEL} est obligatoire`,
	),
})

export type OnboardingBody = v.InferOutput<typeof OnboardingBodySchema>
