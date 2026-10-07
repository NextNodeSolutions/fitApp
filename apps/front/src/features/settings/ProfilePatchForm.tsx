import { RADIO_FIELDS, TEXT_FIELDS } from '@fitapp/contracts'

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
		<div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
			<h2 className="text-lg font-semibold">Mon profil</h2>
			<form noValidate onSubmit={onSubmit} className="mt-4 space-y-5">
				{serverError ? (
					<div
						role="alert"
						className="border-destructive/50 bg-destructive/10 text-destructive rounded-md border p-3 text-sm"
					>
						{serverError}
					</div>
				) : null}
				{isSaved ? (
					<p role="status" className="text-sm text-lime-400">
						Profil mis à jour.
					</p>
				) : null}
				{TEXT_FIELDS.map(spec => (
					<ProfileTextField key={spec.id} spec={spec} form={form} />
				))}
				{RADIO_FIELDS.map(spec => (
					<ProfileRadioField
						key={spec.name}
						spec={spec}
						form={form}
					/>
				))}
				<ProfileSaveButton submitting={form.formState.isSubmitting} />
			</form>
		</div>
	)
}
