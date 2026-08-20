import {
	AUTH_BASE_PATH,
	AuthSessionSchema,
	AuthUserSchema,
} from '@fitapp/contracts'
import * as v from 'valibot'

import { fetchFromApi } from '../api'

import type { AuthSession, AuthUser } from '@fitapp/contracts'

const GetSessionResponseSchema = v.object({
	user: AuthUserSchema,
	session: AuthSessionSchema,
})

export type FrontSession = {
	user: AuthUser
	session: AuthSession
}

export async function getSession(
	env: Pick<Env, 'API'>,
	cookie: string | null,
): Promise<FrontSession | null> {
	if (!cookie) return null
	try {
		const response = await fetchFromApi(
			env,
			`${AUTH_BASE_PATH}/get-session`,
			{ headers: { cookie } },
		)
		if (!response.ok) return null
		const payload: unknown = await response.json()
		const parsed = v.safeParse(GetSessionResponseSchema, payload)
		if (!parsed.success) return null
		return parsed.output
	} catch {
		return null
	}
}
