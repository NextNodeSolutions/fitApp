import { Hono } from 'hono'

import { createAuth } from '../create-auth'

export function createAuthRoutes(): Hono<{ Bindings: Env }> {
	const authRoutes = new Hono<{ Bindings: Env }>()

	authRoutes.all('/*', async res => {
		const auth = createAuth(res.env)
		return auth.handler(res.req.raw)
	})

	return authRoutes
}
