import * as v from 'valibot'

import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from './constants'

export const PASSWORD_CONFIRMATION_REQUIRED =
	'La confirmation du mot de passe est obligatoire'
export const PASSWORD_CONFIRMATION_MISMATCH =
	'Les mots de passe ne correspondent pas'

export const SignUpFormSchema = v.pipe(
	v.object({
		email: v.pipe(
			v.string(),
			v.trim(),
			v.minLength(1, "L'email est obligatoire"),
			v.email("L'email n'est pas valide"),
		),
		password: v.pipe(
			v.string(),
			v.minLength(1, 'Le mot de passe est obligatoire'),
			v.minLength(
				PASSWORD_MIN_LENGTH,
				`Le mot de passe doit contenir au moins ${PASSWORD_MIN_LENGTH} caractères`,
			),
			v.maxLength(
				PASSWORD_MAX_LENGTH,
				`Le mot de passe doit contenir au plus ${PASSWORD_MAX_LENGTH} caractères`,
			),
		),
		passwordConfirmation: v.pipe(
			v.string(),
			v.minLength(1, PASSWORD_CONFIRMATION_REQUIRED),
		),
	}),
	v.forward(
		v.partialCheck(
			[['password'], ['passwordConfirmation']],
			values => values.password === values.passwordConfirmation,
			PASSWORD_CONFIRMATION_MISMATCH,
		),
		['passwordConfirmation'],
	),
)

export type SignUpFormValues = v.InferInput<typeof SignUpFormSchema>
export type SignUpFormField = keyof SignUpFormValues

const SIGN_UP_FIELDS = [
	'email',
	'password',
	'passwordConfirmation',
] as const satisfies readonly SignUpFormField[]

export function isSignUpFormField(field: string): field is SignUpFormField {
	return SIGN_UP_FIELDS.some(name => name === field)
}

export function getSignUpFormErrors(
	values: SignUpFormValues,
): Partial<Record<SignUpFormField, string>> {
	const result = v.safeParse(SignUpFormSchema, values)
	if (result.success) return {}
	const errors: Partial<Record<SignUpFormField, string>> = {}
	for (const issue of result.issues) {
		const key = issue.path?.[0]?.key
		if (typeof key !== 'string') continue
		if (!isSignUpFormField(key)) continue
		if (errors[key]) continue
		errors[key] = issue.message
	}
	return errors
}
