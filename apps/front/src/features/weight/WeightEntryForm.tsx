import { weightUnitLabel } from '@fitapp/contracts'
import {
	Alert,
	Card,
	CardDescription,
	CardTitle,
	SubmitButton,
} from '@fitapp/ui'

import { formatWeight } from './format-weight'
import { useWeightForm } from './use-weight-form'
import { WeightDateField } from './weight-date-field'
import { WeightEntryField } from './weight-entry-field'

import type { Units } from '@fitapp/contracts'
import type { ReactElement } from 'react'

type WeightEntryFormProps = {
	units: Units
	todayWeightDisplay?: string
}

export function WeightEntryForm({
	units,
	todayWeightDisplay,
}: WeightEntryFormProps): ReactElement {
	const { form, onSubmit } = useWeightForm(units, todayWeightDisplay)
	const serverError = form.formState.errors.root?.message

	return (
		<Card>
			<CardTitle>Nouvelle pesée</CardTitle>
			{todayWeightDisplay ? (
				<CardDescription className="mt-1">
					Pesée du jour déjà enregistrée :{' '}
					{formatWeight(
						Number(todayWeightDisplay),
						weightUnitLabel(units),
					)}
				</CardDescription>
			) : null}
			<form noValidate onSubmit={onSubmit} className="mt-5 space-y-5">
				{serverError ? <Alert role="alert">{serverError}</Alert> : null}
				<div className="grid gap-5 sm:grid-cols-2 sm:gap-3">
					<WeightDateField form={form} />
					<WeightEntryField form={form} units={units} />
				</div>
				<SubmitButton
					pending={form.formState.isSubmitting}
					pendingLabel="Enregistrement…"
					size="lg"
					className="w-full"
				>
					Enregistrer la pesée
				</SubmitButton>
			</form>
		</Card>
	)
}
