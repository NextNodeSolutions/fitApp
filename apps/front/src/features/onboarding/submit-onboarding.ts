import {
	CONNECTION_ERROR,
	INVALID_SERVER_RESPONSE_ERROR,
	ONBOARDING_SAVE_ERROR,
	OnboardingCreatedResponseSchema,
	OnboardingErrorResponseSchema,
} from '@fitapp/contracts'
import * as v from 'valibot'

import type { OnboardingBody } from '@fitapp/contracts'

export type SubmitResult =
	| { ok: true; sessionId: string }
	| { ok: false; error: string }

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
					? parsed.output.errors.join(' ')
					: ONBOARDING_SAVE_ERROR,
			}
		}
		const created = v.safeParse(OnboardingCreatedResponseSchema, payload)
		if (!created.success) {
			return { ok: false, error: INVALID_SERVER_RESPONSE_ERROR }
		}
		return { ok: true, sessionId: created.output.sessionId }
	} catch {
		return { ok: false, error: CONNECTION_ERROR }
	}
}
