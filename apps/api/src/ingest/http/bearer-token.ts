const BEARER_PREFIX = 'Bearer '

export function readBearerToken(
	authorization: string | undefined,
): string | null {
	if (!authorization?.startsWith(BEARER_PREFIX)) return null
	const token = authorization.slice(BEARER_PREFIX.length).trim()
	return token || null
}
