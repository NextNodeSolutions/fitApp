import * as v from 'valibot'

import { AppError } from '../errors/app-error'
import { AuthenticationError } from '../errors/business/authentication-error'
import { EmailAlreadyUsedError } from '../errors/business/email-already-used-error'
import { AuthUnavailableError } from '../errors/technical/auth-unavailable-error'

import {
	AuthErrorResponseSchema,
	BETTER_AUTH_INVALID_CREDENTIALS_CODES,
	BETTER_AUTH_USER_ALREADY_EXISTS_CODE,
} from './responses'

// Better Auth error payload → typed error. Single routing table so every
// consumer (sign-up, sign-in, future auth flows) maps codes the same way:
// known credential codes are business errors, everything else — config
// rejection, server failure, unknown code, unparseable payload — is a
// technical error.
const AUTH_ERROR_BY_CODE: Record<string, () => AppError> = {
	[BETTER_AUTH_USER_ALREADY_EXISTS_CODE]: () => new EmailAlreadyUsedError(),
	...Object.fromEntries(
		BETTER_AUTH_INVALID_CREDENTIALS_CODES.map(code => [
			code,
			() => new AuthenticationError(),
		]),
	),
}

export function readAuthError(payload: unknown): AppError {
	const parsed = v.safeParse(AuthErrorResponseSchema, payload)
	if (parsed.success && parsed.output.code) {
		const error = AUTH_ERROR_BY_CODE[parsed.output.code]
		if (error) return error()
	}
	return new AuthUnavailableError()
}
