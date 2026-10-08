import type { ActivityLevel, Sex } from '../onboarding/constants'

export const MIFFLIN_ST_JEOR_WEIGHT_FACTOR = 10
export const MIFFLIN_ST_JEOR_HEIGHT_FACTOR = 6.25
export const MIFFLIN_ST_JEOR_AGE_FACTOR = 5
export const MIFFLIN_ST_JEOR_SEX_OFFSET: Record<Sex, number> = {
	male: 5,
	female: -161,
}

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
	sedentary: 1.2,
	light: 1.375,
	moderate: 1.55,
	active: 1.725,
	very_active: 1.9,
}

export const KCAL_PER_GRAM = { protein: 4, carbs: 4, fat: 9 } as const

export const PROTEIN_G_PER_KG = 2
export const FAT_G_PER_KG = 0.8

export const CALORIE_BALANCE_TOLERANCE_KCAL = 50
