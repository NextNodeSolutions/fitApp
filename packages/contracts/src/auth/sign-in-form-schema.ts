import * as v from 'valibot'

import { EmailFieldSchema } from './email-field-schema'
import { PasswordFieldSchema } from './password-field-schema'

export const SignInFormSchema = v.object({
	email: EmailFieldSchema,
	password: PasswordFieldSchema,
})

export type SignInFormValues = v.InferInput<typeof SignInFormSchema>
export type SignInFormField = keyof SignInFormValues
