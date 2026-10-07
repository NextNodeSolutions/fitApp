import { RadioGroup } from '@fitapp/ui'
import { Controller } from 'react-hook-form'

import { ProfileRadioOptionRow } from './profile-radio-option-row'

import type { RadioFieldSpec } from '@fitapp/contracts'
import type { ReactElement } from 'react'
import type { ProfileFormApi } from './use-profile-form'

export function ProfileRadioField({
	spec,
	form,
}: {
	spec: RadioFieldSpec
	form: ProfileFormApi
}): ReactElement {
	return (
		<Controller
			name={spec.name}
			control={form.control}
			render={({ field, fieldState }) => (
				<div className="space-y-3">
					<span
						id={`${spec.name}-label`}
						className="block text-sm font-medium"
					>
						{spec.label}
					</span>
					<RadioGroup
						aria-labelledby={`${spec.name}-label`}
						name={field.name}
						value={field.value}
						onValueChange={field.onChange}
						aria-invalid={!!fieldState.error}
					>
						{spec.options.map(option => (
							<ProfileRadioOptionRow
								key={option.value}
								option={option}
							/>
						))}
					</RadioGroup>
					{fieldState.error?.message ? (
						<p className="text-destructive text-sm">
							{fieldState.error.message}
						</p>
					) : null}
				</div>
			)}
		/>
	)
}
