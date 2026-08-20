import * as v from 'valibot'

import { EmailFieldSchema } from './email-field-schema'
import { firstFieldMessages } from './first-field-messages'
import { PasswordFieldSchema } from './password-field-schema'

export const SignInFormSchema = v.object({
	email: EmailFieldSchema,
	password: PasswordFieldSchema,
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
	return firstFieldMessages(result.issues, isSignInFormField)
}
