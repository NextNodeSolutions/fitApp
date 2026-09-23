import {
	AUTH_SIGN_IN_PATH,
	AuthSuccessResponseSchema,
	ConnectionError,
	InvalidServerResponseError,
	readAuthError,
} from '@fitapp/contracts'
import * as v from 'valibot'

import type { SignInFormValues } from '@fitapp/contracts'
import type { SubmitAuthResult } from './submit-auth-result'

export async function submitSignIn(
	values: SignInFormValues,
): Promise<SubmitAuthResult> {
	try {
		const response = await fetch(AUTH_SIGN_IN_PATH, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(values),
		})
		const payload: unknown = await response.json()
		if (!response.ok) {
			return { ok: false, error: readAuthError(payload) }
		}
		const created = v.safeParse(AuthSuccessResponseSchema, payload)
		if (!created.success) {
			return { ok: false, error: new InvalidServerResponseError() }
		}
		return { ok: true }
	} catch {
		return { ok: false, error: new ConnectionError() }
	}
}
