import {
	ConnectionError,
	InvalidServerResponseError,
	SettingsAccountDeletedResponseSchema,
	SaveFailedError,
	ValidationErrorResponseSchema,
} from '@fitapp/contracts'
import * as v from 'valibot'

import type { AppError } from '@fitapp/contracts'

const SETTINGS_ACCOUNT_PATH = '/api/settings/account'
const FAILED_DELETE_MESSAGES = [
	'La suppression du compte a échoué, réessaie',
] as const

export type SubmitDeleteResult = { ok: true } | { ok: false; error: AppError }

export async function submitDeleteAccount(): Promise<SubmitDeleteResult> {
	try {
		const response = await fetch(SETTINGS_ACCOUNT_PATH, {
			method: 'DELETE',
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
						: FAILED_DELETE_MESSAGES,
				),
			}
		}
		const parsed = v.safeParse(
			SettingsAccountDeletedResponseSchema,
			payload,
		)
		if (!parsed.success) {
			return { ok: false, error: new InvalidServerResponseError() }
		}
		return { ok: true }
	} catch {
		return { ok: false, error: new ConnectionError() }
	}
}
