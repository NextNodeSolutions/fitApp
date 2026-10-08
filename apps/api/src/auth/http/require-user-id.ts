import { UnauthorizedError } from '@fitapp/contracts'
import { createMiddleware } from 'hono/factory'

import type { MiddlewareHandler } from 'hono'

export type GetUserId = (env: Env, headers: Headers) => Promise<string | null>

export type AuthenticatedEnv = {
	Bindings: Env
	Variables: { userId: string }
}

// Exposes the session user as `res.get('userId')`, or throws UnauthorizedError
// for app.onError to render as 401.
export function requireUserId(
	getUserId: GetUserId,
): MiddlewareHandler<AuthenticatedEnv> {
	return createMiddleware<AuthenticatedEnv>(async (res, next) => {
		const userId = await getUserId(res.env, res.req.raw.headers)
		if (!userId) throw new UnauthorizedError()
		res.set('userId', userId)
		await next()
	})
}
