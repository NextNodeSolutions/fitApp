import { useForm } from 'react-hook-form'

import { signUpResolver } from './sign-up-resolver'
import { submitSignUp } from './submit-sign-up'

import type { UseFormReturn } from 'react-hook-form'
import type { SignUpFormValues } from './sign-up-resolver'

const ONBOARDING_PATH = '/onboarding'

const EMPTY_VALUES: SignUpFormValues = {
	email: '',
	password: '',
	passwordConfirmation: '',
}

export type SignUpFormApi = UseFormReturn<SignUpFormValues>

export function useSignUpForm(): {
	form: SignUpFormApi
	onSubmit: ReturnType<SignUpFormApi['handleSubmit']>
} {
	const form = useForm<SignUpFormValues>({
		resolver: signUpResolver,
		defaultValues: EMPTY_VALUES,
		mode: 'onChange',
	})

	const onSubmit = form.handleSubmit(async values => {
		form.clearErrors('root')
		const submission = await submitSignUp(values)
		if (!submission.ok) {
			form.setError('root', { message: submission.error.message })
			return
		}
		window.location.href = ONBOARDING_PATH
	})

	return { form, onSubmit }
}
