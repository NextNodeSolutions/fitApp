import { RADIO_FIELDS, TEXT_FIELDS } from '@fitapp/contracts'

import { RadioField } from './radio-field'
import { SubmitButton } from './submit-button'
import { TextField } from './text-field'
import { useOnboardingForm } from './use-onboarding-form'

import type { ReactElement } from 'react'

export function OnboardingForm(): ReactElement {
	const { form, onSubmit } = useOnboardingForm()
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
			{TEXT_FIELDS.map(spec => (
				<TextField key={spec.id} spec={spec} form={form} />
			))}
			{RADIO_FIELDS.map(spec => (
				<RadioField key={spec.name} spec={spec} form={form} />
			))}
			<SubmitButton submitting={form.formState.isSubmitting} />
		</form>
	)
}
