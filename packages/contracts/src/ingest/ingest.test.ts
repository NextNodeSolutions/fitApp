import * as v from 'valibot'
import { describe, expect, it } from 'vitest'

import {
	API_TOKEN_HEX_LENGTH,
	API_TOKEN_HEX_PATTERN,
	INGEST_INVALID_BODY_MESSAGE,
	INGEST_INVALID_TOKEN_MESSAGE,
	INGEST_SOURCE_AI,
	IngestBodySchema,
	IngestInsertedResponseSchema,
	IngestInvalidBodyResponseSchema,
	IngestInvalidTokenResponseSchema,
} from './index'

const VALID_ITEM = {
	name: 'Poulet',
	calories: 250,
	protein_g: 30,
	carbs_g: 0,
	fat_g: 12,
}

const VALID_BODY = {
	date: '2026-04-12',
	items: [VALID_ITEM],
}

describe('IngestBodySchema', () => {
	it('accepts a valid payload', () => {
		const result = v.safeParse(IngestBodySchema, VALID_BODY)
		expect(result.success).toBe(true)
		if (!result.success) return
		expect(result.output).toEqual(VALID_BODY)
	})

	it('defaults omitted macros to 0', () => {
		const result = v.safeParse(IngestBodySchema, {
			date: '2026-04-12',
			items: [{ name: 'Pomme', calories: 80 }],
		})
		expect(result.success).toBe(true)
		if (!result.success) return
		expect(result.output.items[0]).toEqual({
			name: 'Pomme',
			calories: 80,
			protein_g: 0,
			carbs_g: 0,
			fat_g: 0,
		})
	})

	it('rejects an empty items list', () => {
		const result = v.safeParse(IngestBodySchema, {
			date: '2026-04-12',
			items: [],
		})
		expect(result.success).toBe(false)
	})

	it('rejects a non ISO date', () => {
		const result = v.safeParse(IngestBodySchema, {
			...VALID_BODY,
			date: '12/04/2026',
		})
		expect(result.success).toBe(false)
	})

	it('rejects an empty name', () => {
		const result = v.safeParse(IngestBodySchema, {
			date: '2026-04-12',
			items: [{ ...VALID_ITEM, name: '' }],
		})
		expect(result.success).toBe(false)
	})

	it('rejects unknown keys', () => {
		const result = v.safeParse(IngestBodySchema, {
			...VALID_BODY,
			extra: true,
		})
		expect(result.success).toBe(false)
	})
})

describe('ingest responses', () => {
	it('accepts an inserted count', () => {
		const result = v.safeParse(IngestInsertedResponseSchema, {
			inserted: 2,
		})
		expect(result.success).toBe(true)
	})

	it('keeps the 400 and 401 messages stable', () => {
		expect(
			v.safeParse(IngestInvalidBodyResponseSchema, {
				error: INGEST_INVALID_BODY_MESSAGE,
			}).success,
		).toBe(true)
		expect(
			v.safeParse(IngestInvalidTokenResponseSchema, {
				error: INGEST_INVALID_TOKEN_MESSAGE,
			}).success,
		).toBe(true)
		expect(INGEST_SOURCE_AI).toBe('ai')
	})
})

describe('api token format', () => {
	it('accepts 32 lowercase hex characters', () => {
		const token = 'a'.repeat(API_TOKEN_HEX_LENGTH)
		expect(API_TOKEN_HEX_PATTERN.test(token)).toBe(true)
	})

	it('rejects uppercase or short tokens', () => {
		expect(
			API_TOKEN_HEX_PATTERN.test('A'.repeat(API_TOKEN_HEX_LENGTH)),
		).toBe(false)
		expect(API_TOKEN_HEX_PATTERN.test('ab')).toBe(false)
	})
})
