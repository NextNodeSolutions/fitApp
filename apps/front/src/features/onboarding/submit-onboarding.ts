import {
	ConnectionError,
	InvalidServerResponseError,
	OnboardingCreatedResponseSchema,
	OnboardingErrorResponseSchema,
	OnboardingSaveError,
	OnboardingValidationError,
} from '@fitapp/contracts'
import * as v from 'valibot'

import type { AppError, OnboardingBody } from '@fitapp/contracts'

export type SubmitResult =
	| { ok: true; sessionId: string }
	| { ok: false; error: AppError }

export async function submitOnboarding(
	body: OnboardingBody,
): Promise<SubmitResult> {
	try {
		const response = await fetch('/api/onboarding', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		})
		const payload: unknown = await response.json()
		if (!response.ok) {
			const parsed = v.safeParse(OnboardingErrorResponseSchema, payload)
			return {
				ok: false,
				error: parsed.success
					? new OnboardingValidationError(parsed.output.errors)
					: new OnboardingSaveError(),
			}
		}
		const created = v.safeParse(OnboardingCreatedResponseSchema, payload)
		if (!created.success) {
			return { ok: false, error: new InvalidServerResponseError() }
		}
		return { ok: true, sessionId: created.output.sessionId }
	} catch {
		return { ok: false, error: new ConnectionError() }
	}
}
