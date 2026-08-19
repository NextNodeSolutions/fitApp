import {
	getOnboardingFormErrors,
	isOnboardingFormField,
} from '@fitapp/contracts'

import type { OnboardingFormValues } from '@fitapp/contracts'
import type { FieldErrors, Resolver } from 'react-hook-form'

export const onboardingResolver: Resolver<OnboardingFormValues> = values => {
	const messages = getOnboardingFormErrors(values)
	const errors: FieldErrors<OnboardingFormValues> = {}
	for (const [field, message] of Object.entries(messages)) {
		if (!message || !isOnboardingFormField(field)) continue
		errors[field] = { type: 'validate', message }
	}
	if (!Object.keys(errors).length) {
		return { values, errors: {} }
	}
	return { values: {}, errors }
}
