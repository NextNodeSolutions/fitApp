import type { FieldError } from 'react-hook-form'

export function toFieldErrors<TField extends string>(
	messages: Partial<Record<string, string>>,
	isField: (field: string) => field is TField,
): Partial<Record<TField, FieldError>> {
	const errors: Partial<Record<TField, FieldError>> = {}
	for (const [field, message] of Object.entries(messages)) {
		if (!message || !isField(field)) continue
		errors[field] = { type: 'validate', message }
	}
	return errors
}
