import { useState } from 'react'

import { OnboardingFormSchema, toOnboardingBody } from '@fitapp/contracts'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { useForm } from 'react-hook-form'

import { submitProfilePatch } from './submit-profile-patch'

import type { OnboardingFormValues, SettingsProfile } from '@fitapp/contracts'
import type { UseFormReturn } from 'react-hook-form'

export type ProfileFormApi = UseFormReturn<
	OnboardingFormValues,
	undefined,
	OnboardingFormValues
>

export function useProfileForm(profile: SettingsProfile): {
	form: ProfileFormApi
	onSubmit: ReturnType<ProfileFormApi['handleSubmit']>
	isSaved: boolean
} {
	const form = useForm<OnboardingFormValues, undefined, OnboardingFormValues>(
		{
			resolver: valibotResolver<
				OnboardingFormValues,
				undefined,
				OnboardingFormValues
			>(OnboardingFormSchema),
			defaultValues: {
				height: String(profile.height),
				weight: String(profile.weight),
				age: String(profile.age),
				sex: profile.sex,
				activityLevel: profile.activityLevel,
			},
			mode: 'onChange',
		},
	)
	const [isSaved, setSaved] = useState(false)

	const onSubmit = form.handleSubmit(async values => {
		form.clearErrors('root')
		setSaved(false)
		const submission = await submitProfilePatch(toOnboardingBody(values))
		if (!submission.ok) {
			form.setError('root', { message: submission.error.message })
			return
		}
		setSaved(true)
	})

	return { form, onSubmit, isSaved }
}
