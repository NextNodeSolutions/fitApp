import { RadioCard, RadioGroup } from '@fitapp/ui'
import { Controller } from 'react-hook-form'

import type { RadioFieldSpec } from '@fitapp/contracts'
import type { ComponentProps, ReactElement } from 'react'
import type {
	FieldPathByValue,
	FieldValues,
	UseFormReturn,
} from 'react-hook-form'

export function RadioField<TFieldValues extends FieldValues>({
	spec,
	form,
	surface,
}: {
	spec: Omit<RadioFieldSpec, 'name'> & {
		name: FieldPathByValue<TFieldValues, string>
	}
	form: Pick<UseFormReturn<TFieldValues>, 'control'>
	surface: ComponentProps<typeof RadioCard>['surface']
}): ReactElement {
	const labelId = `${spec.name}-label`
	return (
		<Controller
			name={spec.name}
			control={form.control}
			render={({ field, fieldState }) => (
				<div className="space-y-3">
					<span id={labelId} className="block text-sm font-medium">
						{spec.label}
					</span>
					<RadioGroup
						aria-labelledby={labelId}
						name={field.name}
						value={field.value}
						onValueChange={field.onChange}
						aria-invalid={!!fieldState.error}
					>
						{spec.options.map(option => (
							<RadioCard
								key={option.value}
								value={option.value}
								hint={option.hint}
								surface={surface}
							>
								{option.label}
							</RadioCard>
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
