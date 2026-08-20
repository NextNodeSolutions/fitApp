import type { BaseIssue } from 'valibot'

export function firstFieldMessages<Field extends string>(
	issues: readonly BaseIssue<unknown>[],
	isField: (field: string) => field is Field,
): Partial<Record<Field, string>> {
	const errors: Partial<Record<Field, string>> = {}
	for (const issue of issues) {
		const key = issue.path?.[0]?.key
		if (typeof key !== 'string') continue
		if (!isField(key)) continue
		if (errors[key]) continue
		errors[key] = issue.message
	}
	return errors
}
