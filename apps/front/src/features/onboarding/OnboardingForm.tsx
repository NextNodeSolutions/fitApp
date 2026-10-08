import { RADIO_FIELDS, TEXT_FIELDS } from '@fitapp/contracts'
import { Alert } from '@fitapp/ui'

import { RadioField } from './radio-field'
import { SubmitButton } from './submit-button'
import { TextField } from './text-field'
import { useOnboardingForm } from './use-onboarding-form'

import type { ReactElement } from 'react'

export function OnboardingForm(): ReactElement {
	const { form, onSubmit } = useOnboardingForm()
	const serverError = form.formState.errors.root?.message

	return (
		<form noValidate onSubmit={onSubmit} className="space-y-7">
			{serverError ? <Alert role="alert">{serverError}</Alert> : null}
			<div className="grid gap-5 sm:grid-cols-3 sm:gap-3">
				{TEXT_FIELDS.map(spec => (
					<TextField key={spec.id} spec={spec} form={form} />
				))}
			</div>
			{RADIO_FIELDS.map(spec => (
				<RadioField key={spec.name} spec={spec} form={form} />
			))}
			<SubmitButton submitting={form.formState.isSubmitting} />
		</form>
	)
}
