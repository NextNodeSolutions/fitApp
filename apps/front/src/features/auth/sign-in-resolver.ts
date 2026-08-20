import { getSignInFormErrors, isSignInFormField } from '@fitapp/contracts'

import { toFieldErrors } from './to-field-errors'

import type { SignInFormValues } from '@fitapp/contracts'
import type { Resolver } from 'react-hook-form'

export const signInResolver: Resolver<SignInFormValues> = values => {
	const errors = toFieldErrors(getSignInFormErrors(values), isSignInFormField)
	if (!Object.keys(errors).length) {
		return { values, errors: {} }
	}
	return { values: {}, errors }
}
