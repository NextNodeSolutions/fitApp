import { getSignInFormErrors, isSignInFormField } from '@fitapp/contracts'

import type { SignInFormValues } from '@fitapp/contracts'
import type { FieldErrors, Resolver } from 'react-hook-form'

export const signInResolver: Resolver<SignInFormValues> = values => {
	const messages = getSignInFormErrors(values)
	const errors: FieldErrors<SignInFormValues> = {}
	for (const [field, message] of Object.entries(messages)) {
		if (!message || !isSignInFormField(field)) continue
		errors[field] = { type: 'validate', message }
	}
	if (!Object.keys(errors).length) {
		return { values, errors: {} }
	}
	return { values: {}, errors }
}
