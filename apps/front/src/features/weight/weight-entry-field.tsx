import { weightDisplayRange, weightUnitLabel } from '@fitapp/contracts'
import { Input, Label } from '@fitapp/ui'

import type { Units } from '@fitapp/contracts'
import type { ReactElement } from 'react'
import type { WeightFormApi } from './use-weight-form'

export function WeightEntryField({
	form,
	units,
}: {
	form: WeightFormApi
	units: Units
}): ReactElement {
	const weightError = form.formState.errors.weight?.message
	const weightRange = weightDisplayRange(units)
	return (
		<div className="space-y-2">
			<Label htmlFor="weight-entry-weight">
				Poids ({weightUnitLabel(units)})
			</Label>
			<Input
				id="weight-entry-weight"
				type="number"
				min={weightRange.min}
				max={weightRange.max}
				step="0.1"
				placeholder="72.5"
				aria-invalid={!!weightError}
				{...form.register('weight')}
			/>
			{weightError ? (
				<p className="text-destructive text-sm">{weightError}</p>
			) : null}
		</div>
	)
}
