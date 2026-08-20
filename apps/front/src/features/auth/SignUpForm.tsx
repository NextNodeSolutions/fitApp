import { SIGN_UP_FIELDS } from '@fitapp/contracts'

import { AuthSubmitButton } from './auth-submit-button'
import { AuthTextField } from './auth-text-field'
import { useSignUpForm } from './use-sign-up-form'

import type { ReactElement } from 'react'

export function SignUpForm(): ReactElement {
	const { form, onSubmit } = useSignUpForm()
	const serverError = form.formState.errors.root?.message

	return (
		<form
			noValidate
			onSubmit={onSubmit}
			className="mx-auto max-w-md space-y-6"
		>
			{serverError ? (
				<div
					role="alert"
					className="border-destructive/50 bg-destructive/10 text-destructive rounded-md border p-3 text-sm"
				>
					{serverError}
				</div>
			) : null}
			{SIGN_UP_FIELDS.map(spec => (
				<AuthTextField
					key={spec.id}
					spec={spec}
					registration={form.register(spec.id)}
					error={form.formState.errors[spec.id]?.message}
				/>
			))}
			<AuthSubmitButton
				submitting={form.formState.isSubmitting}
				label="Créer mon compte"
				loadingLabel="Création du compte…"
			/>
		</form>
	)
}
