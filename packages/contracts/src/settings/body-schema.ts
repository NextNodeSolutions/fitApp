import * as v from 'valibot'

import {
	ActivityLevelFieldSchema,
	AgeFieldSchema,
	HeightFieldSchema,
	SexFieldSchema,
	WeightFieldSchema,
} from '../onboarding/body-schema'

import { UNITS_VALUES } from './units'

export const SettingsProfileBodySchema = v.object({
	height: v.optional(HeightFieldSchema),
	weight: v.optional(WeightFieldSchema),
	age: v.optional(AgeFieldSchema),
	sex: v.optional(SexFieldSchema),
	activityLevel: v.optional(ActivityLevelFieldSchema),
	units: v.optional(
		v.picklist(UNITS_VALUES, "Les unités d'affichage sont invalides"),
	),
})

export type SettingsProfilePatch = v.InferOutput<
	typeof SettingsProfileBodySchema
>
