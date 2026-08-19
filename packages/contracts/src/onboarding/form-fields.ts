import {
	AGE_MAX,
	AGE_MIN,
	HEIGHT_MAX,
	HEIGHT_MIN,
	WEIGHT_MAX,
	WEIGHT_MIN,
} from './constants'

import type { ActivityLevel, Sex } from './constants'
import type { OnboardingFormField } from './form-schema'

export type TextFieldSpec = {
	id: Extract<OnboardingFormField, 'height' | 'weight' | 'age'>
	label: string
	unit: string
	min: number
	max: number
	step?: string
	placeholder: string
}

export type RadioOption<Value extends string = string> = {
	value: Value
	label: string
	hint?: string
}

export type RadioFieldSpec<Value extends string = string> = {
	name: Extract<OnboardingFormField, 'sex' | 'activityLevel'>
	label: string
	options: readonly RadioOption<Value>[]
}

export const TEXT_FIELDS = [
	{
		id: 'height',
		label: 'Taille',
		unit: 'cm',
		min: HEIGHT_MIN,
		max: HEIGHT_MAX,
		placeholder: '175',
	},
	{
		id: 'weight',
		label: 'Poids',
		unit: 'kg',
		min: WEIGHT_MIN,
		max: WEIGHT_MAX,
		step: '0.1',
		placeholder: '72.5',
	},
	{
		id: 'age',
		label: 'Âge',
		unit: 'ans',
		min: AGE_MIN,
		max: AGE_MAX,
		placeholder: '28',
	},
] as const satisfies readonly TextFieldSpec[]

export const SEX_OPTIONS = [
	{ value: 'male', label: 'Homme' },
	{ value: 'female', label: 'Femme' },
] as const satisfies readonly RadioOption<Sex>[]

export const ACTIVITY_LEVEL_OPTIONS = [
	{
		value: 'sedentary',
		label: 'Sédentaire',
		hint: "Peu ou pas d'exercice",
	},
	{ value: 'light', label: 'Légèrement actif', hint: '1 à 3 fois/semaine' },
	{
		value: 'moderate',
		label: 'Modérément actif',
		hint: '3 à 5 fois/semaine',
	},
	{ value: 'active', label: 'Actif', hint: '6 à 7 fois/semaine' },
	{
		value: 'very_active',
		label: 'Très actif',
		hint: 'Métier physique ou sport intensif',
	},
] as const satisfies readonly RadioOption<ActivityLevel>[]

export const RADIO_FIELDS = [
	{ name: 'sex', label: 'Sexe', options: SEX_OPTIONS },
	{
		name: 'activityLevel',
		label: "Niveau d'activité",
		options: ACTIVITY_LEVEL_OPTIONS,
	},
] as const satisfies readonly RadioFieldSpec[]
