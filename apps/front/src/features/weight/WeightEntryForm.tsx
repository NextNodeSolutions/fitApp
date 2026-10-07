import { weightUnitLabel } from '@fitapp/contracts'
import { Button } from '@fitapp/ui'
import { LoaderCircle } from 'lucide-react'

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
		<div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
			<h2 className="text-lg font-semibold">Nouvelle pesée</h2>
			<form noValidate onSubmit={onSubmit} className="mt-4 space-y-5">
				{serverError ? (
					<div
						role="alert"
						className="border-destructive/50 bg-destructive/10 text-destructive rounded-md border p-3 text-sm"
					>
						{serverError}
					</div>
				) : null}
				{todayWeightDisplay ? (
					<p className="text-sm text-gray-400">
						Pesée du jour déjà enregistrée : {todayWeightDisplay}{' '}
						{weightUnitLabel(units)}
					</p>
				) : null}
				<WeightDateField form={form} />
				<WeightEntryField form={form} units={units} />
				<Button type="submit" disabled={form.formState.isSubmitting}>
					{form.formState.isSubmitting ? (
						<>
							<LoaderCircle className="animate-spin" />
							Enregistrement…
						</>
					) : (
						'Enregistrer la pesée'
					)}
				</Button>
			</form>
		</div>
	)
}
