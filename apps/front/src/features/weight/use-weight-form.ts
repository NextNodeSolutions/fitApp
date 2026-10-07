import {
	toWeightEntryBody,
	toWeightEntryFormSchema,
	todayIsoDate,
} from '@fitapp/contracts'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { useForm } from 'react-hook-form'

import { submitWeightEntry } from './submit-weight-entry'

import type { Units, WeightEntryFormValues } from '@fitapp/contracts'
import type { UseFormReturn } from 'react-hook-form'

export type WeightFormApi = UseFormReturn<
	WeightEntryFormValues,
	undefined,
	WeightEntryFormValues
>

export function useWeightForm(
	units: Units,
	todayWeightDisplay: string | undefined,
): {
	form: WeightFormApi
	onSubmit: ReturnType<WeightFormApi['handleSubmit']>
} {
	const form = useForm<
		WeightEntryFormValues,
		undefined,
		WeightEntryFormValues
	>({
		resolver: valibotResolver<
			WeightEntryFormValues,
			undefined,
			WeightEntryFormValues
		>(toWeightEntryFormSchema(units)),
		defaultValues: {
			entryDate: todayIsoDate(),
			weight: todayWeightDisplay ?? '',
		},
		mode: 'onChange',
	})

	const onSubmit = form.handleSubmit(async values => {
		form.clearErrors('root')
		const submission = await submitWeightEntry(
			toWeightEntryBody(values, units),
		)
		if (!submission.ok) {
			form.setError('root', { message: submission.error.message })
			return
		}
		window.location.reload()
	})

	return { form, onSubmit }
}
