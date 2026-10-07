import { Input, Label } from '@fitapp/ui'

import type { TextFieldSpec } from '@fitapp/contracts'
import type { ReactElement } from 'react'
import type { ProfileFormApi } from './use-profile-form'

export function ProfileTextField({
	spec,
	form,
}: {
	spec: TextFieldSpec
	form: ProfileFormApi
}): ReactElement {
	const error = form.formState.errors[spec.id]?.message
	return (
		<div className="space-y-2">
			<Label htmlFor={spec.id}>
				{spec.label} ({spec.unit})
			</Label>
			<Input
				id={spec.id}
				type="number"
				min={spec.min}
				max={spec.max}
				step={spec.step}
				placeholder={spec.placeholder}
				aria-invalid={!!error}
				{...form.register(spec.id)}
			/>
			{error ? <p className="text-destructive text-sm">{error}</p> : null}
		</div>
	)
}
