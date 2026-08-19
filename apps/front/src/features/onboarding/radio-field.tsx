import { RadioGroup } from '@fitapp/ui'
import { Controller } from 'react-hook-form'

import { RadioOptionRow } from './radio-option-row'

import type { RadioFieldSpec } from '@fitapp/contracts'
import type { ReactElement } from 'react'
import type { OnboardingFormApi } from './use-onboarding-form'

export function RadioField({
	spec,
	form,
}: {
	spec: RadioFieldSpec
	form: OnboardingFormApi
}): ReactElement {
	return (
		<Controller
			name={spec.name}
			control={form.control}
			render={({ field, fieldState }) => (
				<div className="space-y-2">
					<span className="text-sm font-medium">{spec.label}</span>
					<RadioGroup
						name={field.name}
						value={field.value}
						onValueChange={field.onChange}
						aria-invalid={!!fieldState.error}
					>
						{spec.options.map(option => (
							<RadioOptionRow
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
