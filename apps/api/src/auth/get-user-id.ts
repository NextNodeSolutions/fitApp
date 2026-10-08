import { getAuthSession } from './get-auth-session'

export async function getUserId(
	env: Env,
	headers: Headers,
): Promise<string | null> {
	const authSession = await getAuthSession(env, headers)
	return authSession?.user.id ?? null
}
