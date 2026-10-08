export const HEIGHT_MIN = 100
export const HEIGHT_MAX = 250
export const WEIGHT_MIN = 30
export const WEIGHT_MAX = 300
export const AGE_MIN = 10
export const AGE_MAX = 120

export const SEX_VALUES = ['male', 'female'] as const
export const ACTIVITY_LEVEL_VALUES = [
	'sedentary',
	'light',
	'moderate',
	'active',
	'very_active',
] as const

export type Sex = (typeof SEX_VALUES)[number]
export type ActivityLevel = (typeof ACTIVITY_LEVEL_VALUES)[number]
