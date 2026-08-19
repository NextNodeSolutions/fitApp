import { toOnboardingBody } from '@fitapp/contracts'
import { useForm } from 'react-hook-form'

import { onboardingResolver } from './onboarding-resolver'
import { submitOnboarding } from './submit-onboarding'

import type { OnboardingFormValues } from '@fitapp/contracts'
import type { UseFormReturn } from 'react-hook-form'

const SESSION_STORAGE_KEY = 'fitapp_session'
const DASHBOARD_PATH = '/dashboard'

const EMPTY_VALUES: OnboardingFormValues = {
	height: '',
	weight: '',
	age: '',
	sex: '',
	activityLevel: '',
}

export type OnboardingFormApi = UseFormReturn<OnboardingFormValues>

export function useOnboardingForm(): {
	form: OnboardingFormApi
	onSubmit: ReturnType<OnboardingFormApi['handleSubmit']>
} {
	const form = useForm<OnboardingFormValues>({
		resolver: onboardingResolver,
		defaultValues: EMPTY_VALUES,
		mode: 'onChange',
	})

	const onSubmit = form.handleSubmit(async values => {
		form.clearErrors('root')
		const submission = await submitOnboarding(toOnboardingBody(values))
		if (!submission.ok) {
			form.setError('root', { message: submission.error })
			return
		}
		localStorage.setItem(SESSION_STORAGE_KEY, submission.sessionId)
		window.location.href = DASHBOARD_PATH
	})

	return { form, onSubmit }
}
