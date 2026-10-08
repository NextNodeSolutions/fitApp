import {
	ACTIVITY_MULTIPLIERS,
	MIFFLIN_ST_JEOR_AGE_FACTOR,
	MIFFLIN_ST_JEOR_HEIGHT_FACTOR,
	MIFFLIN_ST_JEOR_SEX_OFFSET,
	MIFFLIN_ST_JEOR_WEIGHT_FACTOR,
} from './constants'

import type { ActivityLevel, Sex } from '../onboarding/constants'
import type { SettingsProfile } from '../settings/responses'

export type BmrInput = {
	weightKg: number
	heightCm: number
	age: number
	sex: Sex
}

export function computeBmr({ weightKg, heightCm, age, sex }: BmrInput): number {
	return Math.round(
		MIFFLIN_ST_JEOR_WEIGHT_FACTOR * weightKg +
			MIFFLIN_ST_JEOR_HEIGHT_FACTOR * heightCm -
			MIFFLIN_ST_JEOR_AGE_FACTOR * age +
			MIFFLIN_ST_JEOR_SEX_OFFSET[sex],
	)
}

export function computeTdee(bmr: number, activityLevel: ActivityLevel): number {
	return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel])
}

export type CalorieTargetProfile = Pick<
	SettingsProfile,
	'height' | 'age' | 'sex' | 'activityLevel'
>

// Maintenance only for now: the goal adjustment (PROD-36) plugs in here.
export function computeDailyCalorieTarget(
	profile: CalorieTargetProfile,
	weightKg: number,
): number {
	const bmr = computeBmr({
		weightKg,
		heightCm: profile.height,
		age: profile.age,
		sex: profile.sex,
	})
	return computeTdee(bmr, profile.activityLevel)
}
