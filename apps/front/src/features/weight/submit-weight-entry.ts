import {
	ConnectionError,
	InvalidServerResponseError,
	SaveFailedError,
	ValidationErrorResponseSchema,
	WeightEntryResponseSchema,
} from '@fitapp/contracts'
import * as v from 'valibot'

import type { AppError, WeightEntryBody } from '@fitapp/contracts'

const WEIGHT_PATH = '/api/weight'

export type SubmitWeightResult = { ok: true } | { ok: false; error: AppError }

export async function submitWeightEntry(
	body: WeightEntryBody,
): Promise<SubmitWeightResult> {
	try {
		const response = await fetch(WEIGHT_PATH, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		})
		const payload: unknown = await response.json()
		if (!response.ok) {
			const validationErrors = v.safeParse(
				ValidationErrorResponseSchema,
				payload,
			)
			return {
				ok: false,
				error: new SaveFailedError(
					validationErrors.success
						? validationErrors.output.errors
						: undefined,
				),
			}
		}
		const parsed = v.safeParse(WeightEntryResponseSchema, payload)
		if (!parsed.success) {
			return { ok: false, error: new InvalidServerResponseError() }
		}
		return { ok: true }
	} catch {
		return { ok: false, error: new ConnectionError() }
	}
}
