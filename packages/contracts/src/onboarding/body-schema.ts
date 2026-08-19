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

function requiredNumber(
	invalidMessage: string,
	range: string,
	min: number,
	max: number,
) {
	return v.pipe(
		v.number(invalidMessage),
		v.minValue(min, range),
		v.maxValue(max, range),
	)
}

export const OnboardingBodySchema = v.object({
	height: requiredNumber(
		'La taille doit être un nombre valide',
		`La taille doit être entre ${HEIGHT_MIN} et ${HEIGHT_MAX}`,
		HEIGHT_MIN,
		HEIGHT_MAX,
	),
	weight: requiredNumber(
		'Le poids doit être un nombre valide',
		`Le poids doit être entre ${WEIGHT_MIN} et ${WEIGHT_MAX}`,
		WEIGHT_MIN,
		WEIGHT_MAX,
	),
	age: requiredNumber(
		"L'âge doit être un nombre valide",
		`L'âge doit être entre ${AGE_MIN} et ${AGE_MAX}`,
		AGE_MIN,
		AGE_MAX,
	),
	sex: v.picklist(SEX_VALUES, 'Le sexe est obligatoire'),
	activityLevel: v.picklist(
		ACTIVITY_LEVEL_VALUES,
		"Le niveau d'activité est obligatoire",
	),
})

export type OnboardingBody = v.InferOutput<typeof OnboardingBodySchema>
