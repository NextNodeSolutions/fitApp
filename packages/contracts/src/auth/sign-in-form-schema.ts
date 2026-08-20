import * as v from 'valibot'

import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from './constants'

export const SignInFormSchema = v.object({
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
})

export type SignInFormValues = v.InferInput<typeof SignInFormSchema>
export type SignInFormField = keyof SignInFormValues

const SIGN_IN_FIELDS = [
	'email',
	'password',
] as const satisfies readonly SignInFormField[]

export function isSignInFormField(field: string): field is SignInFormField {
	return SIGN_IN_FIELDS.some(name => name === field)
}

export function getSignInFormErrors(
	values: SignInFormValues,
): Partial<Record<SignInFormField, string>> {
	const result = v.safeParse(SignInFormSchema, values)
	if (result.success) return {}
	const errors: Partial<Record<SignInFormField, string>> = {}
	for (const issue of result.issues) {
		const key = issue.path?.[0]?.key
		if (typeof key !== 'string') continue
		if (!isSignInFormField(key)) continue
		if (errors[key]) continue
		errors[key] = issue.message
	}
	return errors
}
