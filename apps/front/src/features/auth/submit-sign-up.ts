import {
	AUTH_SIGN_UP_PATH,
	AuthErrorResponseSchema,
	AuthSuccessResponseSchema,
	AuthenticationError,
	ConnectionError,
	EmailAlreadyUsedError,
	InvalidServerResponseError,
} from '@fitapp/contracts'
import * as v from 'valibot'

import type { AppError, SignUpFormValues } from '@fitapp/contracts'
import type { SubmitAuthResult } from './submit-auth-result'

const EMAIL_ALREADY_USED_CODE = 'USER_ALREADY_EXISTS'

export async function submitSignUp(
	values: SignUpFormValues,
): Promise<SubmitAuthResult> {
	try {
		const response = await fetch(AUTH_SIGN_UP_PATH, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				name: values.email,
				email: values.email,
				password: values.password,
			}),
		})
		const payload: unknown = await response.json()
		if (!response.ok) return { ok: false, error: readSignUpError(payload) }
		const created = v.safeParse(AuthSuccessResponseSchema, payload)
		if (!created.success) {
			return { ok: false, error: new InvalidServerResponseError() }
		}
		return { ok: true }
	} catch {
		return { ok: false, error: new ConnectionError() }
	}
}

function readSignUpError(payload: unknown): AppError {
	const parsed = v.safeParse(AuthErrorResponseSchema, payload)
	if (parsed.success && parsed.output.code === EMAIL_ALREADY_USED_CODE) {
		return new EmailAlreadyUsedError()
	}
	return new AuthenticationError()
}
