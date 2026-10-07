import { SIGN_IN_FIELDS } from '@fitapp/contracts'
import { Alert, SubmitButton } from '@fitapp/ui'

import { AuthTextField } from './auth-text-field'
import { useSignInForm } from './use-sign-in-form'

import type { ReactElement } from 'react'

export function SignInForm(): ReactElement {
	const { form, onSubmit } = useSignInForm()
	const serverError = form.formState.errors.root?.message

	return (
		<form noValidate onSubmit={onSubmit} className="space-y-5">
			{serverError ? <Alert role="alert">{serverError}</Alert> : null}
			{SIGN_IN_FIELDS.map(spec => (
				<AuthTextField
					key={spec.id}
					spec={spec}
					registration={form.register(spec.id)}
					error={form.formState.errors[spec.id]?.message}
				/>
			))}
			<SubmitButton
				pending={form.formState.isSubmitting}
				pendingLabel="Connexion…"
				size="lg"
				className="mt-2 w-full"
			>
				Se connecter
			</SubmitButton>
		</form>
	)
}
