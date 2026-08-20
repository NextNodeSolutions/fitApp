import * as v from 'valibot'
import { describe, expect, it } from 'vitest'

import { AppError } from '../errors/app-error'
import { AuthenticationError } from '../errors/business/authentication-error'
import { EmailAlreadyUsedError } from '../errors/business/email-already-used-error'

import {
	AUTH_SIGN_IN_PATH,
	AUTH_SIGN_UP_PATH,
	PASSWORD_MIN_LENGTH,
	SIGN_IN_FIELDS,
	SIGN_UP_FIELDS,
	SignInFormSchema,
	SignUpFormSchema,
} from './index'

const VALID_SIGN_UP = {
	email: 'jean@example.com',
	password: 'password1',
	passwordConfirmation: 'password1',
}

const VALID_SIGN_IN = {
	email: 'jean@example.com',
	password: 'password1',
}

describe('SignUpFormSchema', () => {
	it('accepts a valid payload', () => {
		expect(v.safeParse(SignUpFormSchema, VALID_SIGN_UP).success).toBe(true)
	})

	it('rejects an invalid email', () => {
		const result = v.safeParse(SignUpFormSchema, {
			...VALID_SIGN_UP,
			email: 'not-an-email',
		})
		expect(result.success).toBe(false)
		if (result.success) return
		expect(result.issues[0]?.message).toBe("L'email n'est pas valide")
	})

	it('rejects a password shorter than the Better Auth minimum', () => {
		const result = v.safeParse(SignUpFormSchema, {
			...VALID_SIGN_UP,
			password: 'short',
		})
		expect(result.success).toBe(false)
		if (result.success) return
		expect(result.issues[0]?.message).toBe(
			`Le mot de passe doit contenir au moins ${PASSWORD_MIN_LENGTH} caractères`,
		)
	})

	it('rejects a password confirmation mismatch', () => {
		const result = v.safeParse(SignUpFormSchema, {
			...VALID_SIGN_UP,
			passwordConfirmation: 'different-password',
		})
		expect(result.success).toBe(false)
		if (result.success) return
		expect(result.issues[0]?.message).toBe(
			'Les mots de passe ne correspondent pas',
		)
	})
})

describe('SignInFormSchema', () => {
	it('accepts a valid payload', () => {
		expect(v.safeParse(SignInFormSchema, VALID_SIGN_IN).success).toBe(true)
	})

	it('rejects an empty email', () => {
		const result = v.safeParse(SignInFormSchema, {
			...VALID_SIGN_IN,
			email: '',
		})
		expect(result.success).toBe(false)
		if (result.success) return
		expect(result.issues[0]?.message).toBe("L'email est obligatoire")
	})
})

describe('auth form fields', () => {
	it('keeps sign-up field ids aligned with the schema', () => {
		expect(SIGN_UP_FIELDS.map(field => field.id)).toEqual([
			'email',
			'password',
			'passwordConfirmation',
		])
	})

	it('keeps sign-in field ids aligned with the schema', () => {
		expect(SIGN_IN_FIELDS.map(field => field.id)).toEqual([
			'email',
			'password',
		])
	})

	it('exposes Better Auth email routes', () => {
		expect(AUTH_SIGN_UP_PATH).toBe('/api/auth/sign-up/email')
		expect(AUTH_SIGN_IN_PATH).toBe('/api/auth/sign-in/email')
	})
})

describe('auth business errors', () => {
	it('exposes an authentication code and HTTP status', () => {
		const error = new AuthenticationError()

		expect(error).toBeInstanceOf(AppError)
		expect(error).toBeInstanceOf(Error)
		expect(error.code).toBe('AUTHENTICATION')
		expect(error.status).toBe(400)
		expect(error.toJSON()).toEqual({
			code: 'AUTHENTICATION',
			message: 'Email ou mot de passe incorrect',
		})
	})

	it('exposes an email-already-used code and HTTP status', () => {
		const error = new EmailAlreadyUsedError()

		expect(error).toBeInstanceOf(AppError)
		expect(error.code).toBe('EMAIL_ALREADY_USED')
		expect(error.status).toBe(400)
		expect(error.toJSON()).toEqual({
			code: 'EMAIL_ALREADY_USED',
			message: 'Cet email est déjà utilisé',
		})
	})
})
