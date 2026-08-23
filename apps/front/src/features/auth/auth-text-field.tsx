import { Input, Label } from '@fitapp/ui'

import type { AuthTextFieldSpec } from '@fitapp/contracts'
import type { ReactElement } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'

export function AuthTextField({
	spec,
	registration,
	error,
}: {
	spec: AuthTextFieldSpec<string>
	registration: UseFormRegisterReturn
	error?: string
}): ReactElement {
	return (
		<div className="space-y-2">
			<Label htmlFor={spec.id}>{spec.label}</Label>
			<Input
				id={spec.id}
				type={spec.type}
				placeholder={spec.placeholder}
				autoComplete={spec.autoComplete}
				minLength={spec.minLength}
				maxLength={spec.maxLength}
				aria-invalid={!!error}
				{...registration}
			/>
			{error ? <p className="text-destructive text-sm">{error}</p> : null}
		</div>
	)
}
