import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from './constants'

import type { SignInFormField } from './sign-in-form-schema'
import type { SignUpFormField } from './sign-up-form-schema'

export type AuthTextFieldSpec<Field extends string = SignUpFormField> = {
	id: Field
	label: string
	type: 'text' | 'email' | 'password'
	placeholder: string
	autoComplete: string
	minLength?: number
	maxLength?: number
}

export const SIGN_UP_FIELDS = [
	{
		id: 'email',
		label: 'Email',
		type: 'email',
		placeholder: 'jean@example.com',
		autoComplete: 'email',
	},
	{
		id: 'password',
		label: 'Mot de passe',
		type: 'password',
		placeholder: '••••••••',
		autoComplete: 'new-password',
		minLength: PASSWORD_MIN_LENGTH,
		maxLength: PASSWORD_MAX_LENGTH,
	},
	{
		id: 'passwordConfirmation',
		label: 'Confirmation du mot de passe',
		type: 'password',
		placeholder: '••••••••',
		autoComplete: 'new-password',
		minLength: PASSWORD_MIN_LENGTH,
		maxLength: PASSWORD_MAX_LENGTH,
	},
] as const satisfies readonly AuthTextFieldSpec[]

export const SIGN_IN_FIELDS = [
	{
		id: 'email',
		label: 'Email',
		type: 'email',
		placeholder: 'jean@example.com',
		autoComplete: 'email',
	},
	{
		id: 'password',
		label: 'Mot de passe',
		type: 'password',
		placeholder: '••••••••',
		autoComplete: 'current-password',
		minLength: PASSWORD_MIN_LENGTH,
		maxLength: PASSWORD_MAX_LENGTH,
	},
] as const satisfies readonly AuthTextFieldSpec<SignInFormField>[]
