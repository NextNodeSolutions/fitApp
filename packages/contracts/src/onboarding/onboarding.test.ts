import * as v from 'valibot'
import { describe, expect, it } from 'vitest'

import {
	ACTIVITY_LEVEL_OPTIONS,
	ACTIVITY_LEVEL_VALUES,
	OnboardingBodySchema,
	OnboardingFormSchema,
	SEX_OPTIONS,
	SEX_VALUES,
	toOnboardingBody,
} from './index'

const VALID_FORM_VALUES = {
	height: '175',
	weight: '72.5',
	age: '28',
	sex: 'male',
	activityLevel: 'moderate',
}

const VALID_BODY = {
	height: 175,
	weight: 72.5,
	age: 28,
	sex: 'male',
	activityLevel: 'moderate',
} as const

describe('OnboardingBodySchema', () => {
	it('accepts a valid payload', () => {
		const result = v.safeParse(OnboardingBodySchema, VALID_BODY)
		expect(result.success).toBe(true)
	})

	it('rejects an out-of-range height', () => {
		const result = v.safeParse(OnboardingBodySchema, {
			...VALID_BODY,
			height: 50,
		})
		expect(result.success).toBe(false)
	})

	it('rejects an unknown sex value', () => {
		const result = v.safeParse(OnboardingBodySchema, {
			...VALID_BODY,
			sex: 'other',
		})
		expect(result.success).toBe(false)
	})

	it('rejects a non-numeric height', () => {
		const result = v.safeParse(OnboardingBodySchema, {
			...VALID_BODY,
			height: 'grand',
		})
		expect(result.success).toBe(false)
	})
})

describe('OnboardingFormSchema', () => {
	it('accepts valid string values', () => {
		const result = v.safeParse(OnboardingFormSchema, VALID_FORM_VALUES)
		expect(result.success).toBe(true)
	})

	it('rejects an empty height', () => {
		const result = v.safeParse(OnboardingFormSchema, {
			...VALID_FORM_VALUES,
			height: '',
		})
		expect(result.success).toBe(false)
		if (result.success) return
		expect(result.issues[0]?.message).toBe('La taille est obligatoire')
	})

	it('rejects a non-numeric height', () => {
		const result = v.safeParse(OnboardingFormSchema, {
			...VALID_FORM_VALUES,
			height: 'abc',
		})
		expect(result.success).toBe(false)
		if (result.success) return
		expect(result.issues[0]?.message).toBe(
			'La taille doit être un nombre valide',
		)
	})

	it('rejects an out-of-range height', () => {
		const result = v.safeParse(OnboardingFormSchema, {
			...VALID_FORM_VALUES,
			height: '50',
		})
		expect(result.success).toBe(false)
		if (result.success) return
		expect(result.issues[0]?.message).toBe(
			'La taille doit être entre 100 et 250',
		)
	})

	it('accepts a decimal weight', () => {
		const result = v.safeParse(OnboardingFormSchema, VALID_FORM_VALUES)
		expect(result.success).toBe(true)
	})

	it('rejects an empty sex', () => {
		const result = v.safeParse(OnboardingFormSchema, {
			...VALID_FORM_VALUES,
			sex: '',
		})
		expect(result.success).toBe(false)
		if (result.success) return
		expect(result.issues[0]?.message).toBe('Le sexe est obligatoire')
	})

	it('converts valid form values into a body', () => {
		expect(toOnboardingBody(VALID_FORM_VALUES)).toEqual(VALID_BODY)
	})

	it('returns an issue per invalid field', () => {
		const result = v.safeParse(OnboardingFormSchema, {
			...VALID_FORM_VALUES,
			height: '',
			age: '200',
		})
		expect(result.success).toBe(false)
		if (result.success) return
		const messages = result.issues.map(issue => issue.message)
		expect(messages).toContain('La taille est obligatoire')
		expect(messages).toContain("L'âge doit être entre 10 et 120")
	})
})

describe('form field options', () => {
	it('keeps sex options aligned with the picklist', () => {
		expect(SEX_OPTIONS.map(option => option.value)).toEqual([...SEX_VALUES])
	})

	it('keeps activity options aligned with the picklist', () => {
		expect(ACTIVITY_LEVEL_OPTIONS.map(option => option.value)).toEqual([
			...ACTIVITY_LEVEL_VALUES,
		])
	})
})
