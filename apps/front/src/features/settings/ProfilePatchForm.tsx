import { RADIO_FIELDS, TEXT_FIELDS } from '@fitapp/contracts'
import { Alert, Card, CardDescription, CardTitle } from '@fitapp/ui'

import { ProfileRadioField } from './profile-radio-field'
import { ProfileSaveButton } from './profile-save-button'
import { ProfileTextField } from './profile-text-field'
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
						<ProfileTextField
							key={spec.id}
							spec={spec}
							form={form}
						/>
					))}
				</div>
				{RADIO_FIELDS.map(spec => (
					<ProfileRadioField
						key={spec.name}
						spec={spec}
						form={form}
					/>
				))}
				<ProfileSaveButton submitting={form.formState.isSubmitting} />
			</form>
		</Card>
	)
}
