import {
	getSignUpFormErrors,
	isSignUpFormField,
	PASSWORD_CONFIRMATION_MISMATCH,
	PASSWORD_CONFIRMATION_REQUIRED,
} from '@fitapp/contracts'

import type { SignUpFormValues } from '@fitapp/contracts'
import type { FieldErrors, Resolver } from 'react-hook-form'

export { PASSWORD_CONFIRMATION_MISMATCH, PASSWORD_CONFIRMATION_REQUIRED }
export type { SignUpFormValues }

export const signUpResolver: Resolver<SignUpFormValues> = values => {
	const messages = getSignUpFormErrors(values)
	const errors: FieldErrors<SignUpFormValues> = {}
	for (const [field, message] of Object.entries(messages)) {
		if (!message || !isSignUpFormField(field)) continue
		errors[field] = { type: 'validate', message }
	}
	if (!Object.keys(errors).length) return { values, errors: {} }
	return { values: {}, errors }
}
