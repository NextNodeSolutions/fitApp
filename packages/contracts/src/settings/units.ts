import type { RadioOption } from '../onboarding/form-fields'

export const UNITS_VALUES = ['metric', 'imperial'] as const

export type Units = (typeof UNITS_VALUES)[number]

export const UNITS_OPTIONS = [
	{ value: 'metric', label: 'Métrique (kg, cm)' },
	{ value: 'imperial', label: 'Impérial (lb, pi)' },
] as const satisfies readonly RadioOption<Units>[]
