import { getSignUpFormErrors, isSignUpFormField } from '@fitapp/contracts'

import { toFieldErrors } from './to-field-errors'

import type { SignUpFormValues } from '@fitapp/contracts'
import type { Resolver } from 'react-hook-form'

export const signUpResolver: Resolver<SignUpFormValues> = values => {
	const errors = toFieldErrors(getSignUpFormErrors(values), isSignUpFormField)
	if (!Object.keys(errors).length) return { values, errors: {} }
	return { values: {}, errors }
}
