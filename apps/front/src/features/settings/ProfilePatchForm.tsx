import { RADIO_FIELDS, TEXT_FIELDS } from '@fitapp/contracts'
import {
	Alert,
	Card,
	CardDescription,
	CardTitle,
	SubmitButton,
} from '@fitapp/ui'

import { RadioField } from '../../components/form/radio-field'
import { TextField } from '../../components/form/text-field'

import { useProfileForm } from './use-profile-form'

import type { SettingsProfile } from '@fitapp/contracts'
import type { ReactElement } from 'react'

type ProfilePatchFormProps = {
	profile: SettingsProfile
}

export function ProfilePatchForm({
	profile,
}: ProfilePatchFormProps): ReactElement {
	const { form, onSubmit, isSaved } = useProfileForm(profile)
	const serverError = form.formState.errors.root?.message

	return (
		<Card>
			<CardTitle>Profil</CardTitle>
			<CardDescription className="mt-1">
				Sert à calculer ta cible calorique et tes macros.
			</CardDescription>
			<form noValidate onSubmit={onSubmit} className="mt-6 space-y-6">
				{serverError ? <Alert role="alert">{serverError}</Alert> : null}
				{isSaved ? (
					<Alert role="status" tone="positive">
						Profil mis à jour.
					</Alert>
				) : null}
				<div className="grid gap-5 sm:grid-cols-3 sm:gap-3">
					{TEXT_FIELDS.map(spec => (
						<TextField key={spec.id} spec={spec} form={form} />
					))}
				</div>
				{RADIO_FIELDS.map(spec => (
					<RadioField
						key={spec.name}
						spec={spec}
						form={form}
						surface="card"
					/>
				))}
				<SubmitButton
					pending={form.formState.isSubmitting}
					pendingLabel="Enregistrement…"
					className="w-full sm:w-auto"
				>
					Enregistrer
				</SubmitButton>
			</form>
		</Card>
	)
}
