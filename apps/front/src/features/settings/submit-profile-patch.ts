import {
	ConnectionError,
	InvalidServerResponseError,
	SaveFailedError,
	SettingsProfileResponseSchema,
	ValidationErrorResponseSchema,
} from '@fitapp/contracts'
import * as v from 'valibot'

import type {
	AppError,
	SettingsProfile,
	SettingsProfilePatch,
} from '@fitapp/contracts'

const SETTINGS_PROFILE_PATH = '/api/settings/profile'

export type SubmitProfileResult =
	| { ok: true; profile: SettingsProfile }
	| { ok: false; error: AppError }

export async function submitProfilePatch(
	body: SettingsProfilePatch,
): Promise<SubmitProfileResult> {
	try {
		const response = await fetch(SETTINGS_PROFILE_PATH, {
			method: 'PATCH',
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
		const parsed = v.safeParse(SettingsProfileResponseSchema, payload)
		if (!parsed.success) {
			return { ok: false, error: new InvalidServerResponseError() }
		}
		return { ok: true, profile: parsed.output.profile }
	} catch {
		return { ok: false, error: new ConnectionError() }
	}
}
