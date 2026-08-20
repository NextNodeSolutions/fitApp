import * as v from 'valibot'

import { EmailFieldSchema } from './email-field-schema'
import { PasswordFieldSchema } from './password-field-schema'

export const PASSWORD_CONFIRMATION_REQUIRED =
	'La confirmation du mot de passe est obligatoire'
export const PASSWORD_CONFIRMATION_MISMATCH =
	'Les mots de passe ne correspondent pas'

export const SignUpFormSchema = v.pipe(
	v.object({
		email: EmailFieldSchema,
		password: PasswordFieldSchema,
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
