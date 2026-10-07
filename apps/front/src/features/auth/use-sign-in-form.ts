import { SignInFormSchema } from '@fitapp/contracts'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { useForm } from 'react-hook-form'

import { ROUTES } from '../../lib/routes'

import { submitSignIn } from './submit-sign-in'

import type { SignInFormValues } from '@fitapp/contracts'
import type { UseFormReturn } from 'react-hook-form'

const EMPTY_VALUES: SignInFormValues = {
	email: '',
	password: '',
}

export type SignInFormApi = UseFormReturn<
	SignInFormValues,
	undefined,
	SignInFormValues
>

export function useSignInForm(): {
	form: SignInFormApi
	onSubmit: ReturnType<SignInFormApi['handleSubmit']>
} {
	const form = useForm<SignInFormValues, undefined, SignInFormValues>({
		resolver: valibotResolver<
			SignInFormValues,
			undefined,
			SignInFormValues
		>(SignInFormSchema),
		defaultValues: EMPTY_VALUES,
		mode: 'onChange',
	})

	const onSubmit = form.handleSubmit(async values => {
		form.clearErrors('root')
		const submission = await submitSignIn(values)
		if (!submission.ok) {
			form.setError('root', { message: submission.error.message })
			return
		}
		window.location.href = ROUTES.dashboard
	})

	return { form, onSubmit }
}
