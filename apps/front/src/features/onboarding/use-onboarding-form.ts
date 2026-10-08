import { OnboardingFormSchema, toOnboardingBody } from '@fitapp/contracts'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { useForm } from 'react-hook-form'

import { ROUTES } from '../../lib/routes'

import { submitOnboarding } from './submit-onboarding'

import type { OnboardingFormValues } from '@fitapp/contracts'
import type { UseFormReturn } from 'react-hook-form'

const EMPTY_VALUES: OnboardingFormValues = {
	height: '',
	weight: '',
	age: '',
	sex: '',
	activityLevel: '',
}

export type OnboardingFormApi = UseFormReturn<
	OnboardingFormValues,
	undefined,
	OnboardingFormValues
>

export function useOnboardingForm(): {
	form: OnboardingFormApi
	onSubmit: ReturnType<OnboardingFormApi['handleSubmit']>
} {
	const form = useForm<OnboardingFormValues, undefined, OnboardingFormValues>(
		{
			resolver: valibotResolver<
				OnboardingFormValues,
				undefined,
				OnboardingFormValues
			>(OnboardingFormSchema),
			defaultValues: EMPTY_VALUES,
			mode: 'onChange',
		},
	)

	const onSubmit = form.handleSubmit(async values => {
		form.clearErrors('root')
		const submission = await submitOnboarding(toOnboardingBody(values))
		if (!submission.ok) {
			form.setError('root', { message: submission.error.message })
			return
		}
		window.location.href = ROUTES.dashboard
	})

	return { form, onSubmit }
}
