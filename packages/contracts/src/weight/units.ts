import { WEIGHT_MAX, WEIGHT_MIN } from '../onboarding/constants'

import type { Units } from '../settings/units'

export const KG_PER_LB = 2.20462

export const WEIGHT_UNIT_LABELS: Record<Units, string> = {
	metric: 'kg',
	imperial: 'lb',
}

export type WeightDisplayRange = { min: number; max: number }

export function weightDisplayRange(units: Units): WeightDisplayRange {
	if (units === 'metric') return { min: WEIGHT_MIN, max: WEIGHT_MAX }
	return {
		min: Math.round((WEIGHT_MIN / KG_PER_LB) * 10) / 10,
		max: Math.round((WEIGHT_MAX / KG_PER_LB) * 10) / 10,
	}
}

export function weightUnitLabel(units: Units): string {
	return WEIGHT_UNIT_LABELS[units]
}

export function weightToDisplayUnit(weightKg: number, units: Units): number {
	if (units === 'metric') return weightKg
	return Math.round((weightKg / KG_PER_LB) * 10) / 10
}

export function weightKilogramsFromDisplay(
	weightDisplay: number,
	units: Units,
): number {
	if (units === 'metric') return weightDisplay
	return Math.round(weightDisplay * KG_PER_LB * 100) / 100
}
