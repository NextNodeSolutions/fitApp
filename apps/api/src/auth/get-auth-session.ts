import { AuthSessionResponseSchema } from '@fitapp/contracts'
import * as v from 'valibot'

import { createAuth } from './create-auth'

import type { AuthSessionResponse } from '@fitapp/contracts'

export async function getAuthSession(
	env: Env,
	headers: Headers,
): Promise<AuthSessionResponse | null> {
	if (!headers.has('cookie')) return null
	const payload: unknown = await createAuth(env).api.getSession({ headers })
	if (payload === null) return null
	const sessionResult = v.safeParse(AuthSessionResponseSchema, payload)
	if (!sessionResult.success) return null
	return sessionResult.output
}
