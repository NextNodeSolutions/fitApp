import * as v from 'valibot'

import { API_TOKEN_HEX_PATTERN } from '../ingest/constants'
import { ACTIVITY_LEVEL_VALUES, SEX_VALUES } from '../onboarding/constants'

import { SETTINGS_PROFILE_NOT_FOUND_MESSAGE } from './constants'
import { UNITS_VALUES } from './units'

export const SettingsTokenResponseSchema = v.object({
	token: v.nullable(v.pipe(v.string(), v.regex(API_TOKEN_HEX_PATTERN))),
})

export type SettingsTokenResponse = v.InferOutput<
	typeof SettingsTokenResponseSchema
>

export const SettingsProfileSchema = v.object({
	height: v.number(),
	weight: v.number(),
	age: v.number(),
	sex: v.picklist(SEX_VALUES),
	activityLevel: v.picklist(ACTIVITY_LEVEL_VALUES),
	units: v.picklist(UNITS_VALUES),
})

export const SettingsProfileResponseSchema = v.object({
	profile: SettingsProfileSchema,
})

export const SettingsProfileNotFoundResponseSchema = v.object({
	error: v.literal(SETTINGS_PROFILE_NOT_FOUND_MESSAGE),
})

export const SettingsAccountDeletedResponseSchema = v.object({
	ok: v.literal(true),
})

export type SettingsProfile = v.InferOutput<typeof SettingsProfileSchema>
export type SettingsProfileResponse = v.InferOutput<
	typeof SettingsProfileResponseSchema
>
