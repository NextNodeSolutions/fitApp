import {
	AUTH_BASE_PATH,
	AuthSessionSchema,
	AuthUserSchema,
} from '@fitapp/contracts'
import * as v from 'valibot'

import { createAuth } from './create-auth'

const GetSessionResponseSchema = v.object({
	user: AuthUserSchema,
	session: AuthSessionSchema,
})

type AuthSessionResponse = v.InferOutput<typeof GetSessionResponseSchema>

export async function getAuthSession(
	env: Env,
	headers: Headers,
): Promise<AuthSessionResponse | null> {
	if (!headers.has('cookie')) return null
	const request = new Request(
		`${env.SITE_URL}${AUTH_BASE_PATH}/get-session`,
		{
			headers: { cookie: headers.get('cookie') ?? '' },
		},
	)
	const response = await createAuth(env).handler(request)
	if (!response.ok) return null
	const payload: unknown = await response.json()
	const sessionResult = v.safeParse(GetSessionResponseSchema, payload)
	if (!sessionResult.success) return null
	return sessionResult.output
}
