import { todayIsoDate } from '@fitapp/contracts'
import { Input, Label } from '@fitapp/ui'

import type { ReactElement } from 'react'
import type { WeightFormApi } from './use-weight-form'

export function WeightDateField({
	form,
}: {
	form: WeightFormApi
}): ReactElement {
	const dateError = form.formState.errors.entryDate?.message
	return (
		<div className="space-y-2">
			<Label htmlFor="weight-entry-date">Date</Label>
			<Input
				id="weight-entry-date"
				type="date"
				max={todayIsoDate()}
				aria-invalid={!!dateError}
				{...form.register('entryDate')}
			/>
			{dateError ? (
				<p className="text-destructive text-sm">{dateError}</p>
			) : null}
		</div>
	)
}
