import { SIGN_UP_FIELDS } from '@fitapp/contracts'
import { Alert, SubmitButton } from '@fitapp/ui'

import { AuthTextField } from './auth-text-field'
import { useSignUpForm } from './use-sign-up-form'

import type { ReactElement } from 'react'

export function SignUpForm(): ReactElement {
	const { form, onSubmit } = useSignUpForm()
	const serverError = form.formState.errors.root?.message

	return (
		<form noValidate onSubmit={onSubmit} className="space-y-5">
			{serverError ? <Alert role="alert">{serverError}</Alert> : null}
			{SIGN_UP_FIELDS.map(spec => (
				<AuthTextField
					key={spec.id}
					spec={spec}
					registration={form.register(spec.id)}
					error={form.formState.errors[spec.id]?.message}
				/>
			))}
			<SubmitButton
				pending={form.formState.isSubmitting}
				pendingLabel="Création du compte…"
				size="lg"
				className="mt-2 w-full"
			>
				Créer mon compte
			</SubmitButton>
		</form>
	)
}
