import * as v from 'valibot'

import { API_TOKEN_HEX_PATTERN } from '../ingest/constants'

import { SETTINGS_UNAUTHORIZED_MESSAGE } from './constants'

export const SettingsTokenResponseSchema = v.object({
	token: v.nullable(v.pipe(v.string(), v.regex(API_TOKEN_HEX_PATTERN))),
})

export const SettingsUnauthorizedResponseSchema = v.object({
	error: v.literal(SETTINGS_UNAUTHORIZED_MESSAGE),
})

export type SettingsTokenResponse = v.InferOutput<
	typeof SettingsTokenResponseSchema
>
export type SettingsUnauthorizedResponse = v.InferOutput<
	typeof SettingsUnauthorizedResponseSchema
>
