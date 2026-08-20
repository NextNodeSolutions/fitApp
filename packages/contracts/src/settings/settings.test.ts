import * as v from 'valibot'
import { describe, expect, it } from 'vitest'

import { API_TOKEN_HEX_LENGTH } from '../ingest/constants'

import {
	SETTINGS_UNAUTHORIZED_MESSAGE,
	SettingsTokenResponseSchema,
	SettingsUnauthorizedResponseSchema,
} from './index'

describe('SettingsTokenResponseSchema', () => {
	it('accepts a null token', () => {
		const result = v.safeParse(SettingsTokenResponseSchema, { token: null })
		expect(result.success).toBe(true)
	})

	it('accepts a 32 lowercase hex token', () => {
		const result = v.safeParse(SettingsTokenResponseSchema, {
			token: 'b'.repeat(API_TOKEN_HEX_LENGTH),
		})
		expect(result.success).toBe(true)
	})

	it('rejects an invalid token', () => {
		const result = v.safeParse(SettingsTokenResponseSchema, {
			token: 'not-a-token',
		})
		expect(result.success).toBe(false)
	})
})

describe('SettingsUnauthorizedResponseSchema', () => {
	it('keeps the unauthorized message stable', () => {
		const result = v.safeParse(SettingsUnauthorizedResponseSchema, {
			error: SETTINGS_UNAUTHORIZED_MESSAGE,
		})
		expect(result.success).toBe(true)
	})
})
