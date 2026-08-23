import { API_TOKEN_HEX_LENGTH, API_TOKEN_HEX_PATTERN } from '@fitapp/contracts'
import { describe, expect, it } from 'vitest'

import { generateApiToken } from './generate-api-token'

describe('generateApiToken', () => {
	it('returns 16 random bytes as 32 lowercase hexadecimal characters', () => {
		const token = generateApiToken()

		expect(token).toHaveLength(API_TOKEN_HEX_LENGTH)
		expect(token).toMatch(API_TOKEN_HEX_PATTERN)
	})

	it('does not reuse a generated token', () => {
		expect(generateApiToken()).not.toBe(generateApiToken())
	})
})
