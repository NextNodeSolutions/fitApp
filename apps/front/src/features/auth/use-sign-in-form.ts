import { useForm } from 'react-hook-form'

import { signInResolver } from './sign-in-resolver'
import { submitSignIn } from './submit-sign-in'

import type { SignInFormValues } from '@fitapp/contracts'
import type { UseFormReturn } from 'react-hook-form'

const DASHBOARD_PATH = '/dashboard'

const EMPTY_VALUES: SignInFormValues = {
	email: '',
	password: '',
}

export type SignInFormApi = UseFormReturn<SignInFormValues>

export function useSignInForm(): {
	form: SignInFormApi
	onSubmit: ReturnType<SignInFormApi['handleSubmit']>
} {
	const form = useForm<SignInFormValues>({
		resolver: signInResolver,
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
		window.location.href = DASHBOARD_PATH
	})

	return { form, onSubmit }
}
