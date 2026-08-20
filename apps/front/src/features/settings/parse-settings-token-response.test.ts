import { API_TOKEN_HEX_LENGTH } from '@fitapp/contracts'
import { describe, expect, it } from 'vitest'

import { parseSettingsTokenResponse } from './parse-settings-token-response'

const VALID_TOKEN = 'a'.repeat(API_TOKEN_HEX_LENGTH)

describe('parseSettingsTokenResponse', () => {
	it('returns the token from a valid response', () => {
		expect(parseSettingsTokenResponse({ token: VALID_TOKEN })).toBe(
			VALID_TOKEN,
		)
	})

	it('returns null when the response carries a null token', () => {
		expect(parseSettingsTokenResponse({ token: null })).toBeNull()
	})

	it('returns null when the token is not 32 lowercase hex chars', () => {
		expect(
			parseSettingsTokenResponse({ token: 'not-a-valid-token' }),
		).toBeNull()
	})

	it('returns null for a malformed payload', () => {
		expect(parseSettingsTokenResponse({ error: 'Unauthorized' })).toBeNull()
		expect(parseSettingsTokenResponse('nope')).toBeNull()
		expect(parseSettingsTokenResponse(null)).toBeNull()
	})
})
