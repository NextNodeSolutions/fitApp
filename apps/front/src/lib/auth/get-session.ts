import { AUTH_BASE_PATH, AuthSessionResponseSchema } from '@fitapp/contracts'
import * as v from 'valibot'

import { fetchFromApi } from '../api'

import type { AuthSessionResponse } from '@fitapp/contracts'

export type FrontSession = AuthSessionResponse

export async function getSession(
	env: Pick<Env, 'API'>,
	cookie: string | null,
): Promise<AuthSessionResponse | null> {
	if (!cookie) return null
	try {
		const response = await fetchFromApi(
			env,
			`${AUTH_BASE_PATH}/get-session`,
			{ headers: { cookie } },
		)
		if (!response.ok) return null
		const payload: unknown = await response.json()
		const parsed = v.safeParse(AuthSessionResponseSchema, payload)
		if (!parsed.success) return null
		return parsed.output
	} catch {
		return null
	}
}
