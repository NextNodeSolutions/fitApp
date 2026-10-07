import { Input, Label } from '@fitapp/ui'

import type { TextFieldSpec } from '@fitapp/contracts'
import type { ReactElement } from 'react'
import type { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form'

export function TextField<TFieldValues extends FieldValues>({
	spec,
	form,
}: {
	spec: Omit<TextFieldSpec, 'id'> & { id: FieldPath<TFieldValues> }
	form: Pick<
		UseFormReturn<TFieldValues>,
		'register' | 'getFieldState' | 'formState'
	>
}): ReactElement {
	const error = form.getFieldState(spec.id, form.formState).error?.message
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
