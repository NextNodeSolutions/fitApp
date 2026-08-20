import { describe, expect, it } from 'vitest'

import {
	PASSWORD_CONFIRMATION_MISMATCH,
	PASSWORD_CONFIRMATION_REQUIRED,
	signUpResolver,
} from './sign-up-resolver'

import type { SignUpFormValues } from './sign-up-resolver'

const VALID_VALUES: SignUpFormValues = {
	email: 'jean@example.com',
	password: 'mot-de-passe-solide',
	passwordConfirmation: 'mot-de-passe-solide',
}

describe('signUpResolver', () => {
	it('accepts valid values', async () => {
		const outcome = await signUpResolver(VALID_VALUES, undefined, {
			fields: {},
			shouldUseNativeValidation: false,
		})

		expect(outcome).toEqual({ values: VALID_VALUES, errors: {} })
	})

	it('rejects an empty confirmation', async () => {
		const outcome = await signUpResolver(
			{ ...VALID_VALUES, passwordConfirmation: '' },
			undefined,
			{ fields: {}, shouldUseNativeValidation: false },
		)

		expect(outcome).toEqual({
			values: {},
			errors: {
				passwordConfirmation: {
					type: 'validate',
					message: PASSWORD_CONFIRMATION_REQUIRED,
				},
			},
		})
	})

	it('rejects a mismatching confirmation', async () => {
		const outcome = await signUpResolver(
			{ ...VALID_VALUES, passwordConfirmation: 'autre-mot-de-passe' },
			undefined,
			{ fields: {}, shouldUseNativeValidation: false },
		)

		expect(outcome).toEqual({
			values: {},
			errors: {
				passwordConfirmation: {
					type: 'validate',
					message: PASSWORD_CONFIRMATION_MISMATCH,
				},
			},
		})
	})

	it('reports the shared contracts field errors', async () => {
		const outcome = await signUpResolver(
			{ ...VALID_VALUES, email: 'pas-un-email' },
			undefined,
			{ fields: {}, shouldUseNativeValidation: false },
		)

		expect(outcome).toEqual({
			values: {},
			errors: {
				email: {
					type: 'validate',
					message: "L'email n'est pas valide",
				},
			},
		})
	})
})
