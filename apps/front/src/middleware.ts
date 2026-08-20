import { defineMiddleware } from 'astro:middleware'

import { env } from 'cloudflare:workers'

import { getSession } from './lib/auth/get-session'
import { resolveAuthRedirect } from './lib/auth/resolve-auth-redirect'

export const onRequest = defineMiddleware(async (context, next) => {
	Object.assign(context.locals, { user: null, session: null })
	const session = await getSession(env, context.request.headers.get('cookie'))
	if (session) {
		Object.assign(context.locals, {
			user: session.user,
			session: session.session,
		})
	}
	const redirect = resolveAuthRedirect(context.url.pathname, session !== null)
	if (redirect) return context.redirect(redirect)
	return next()
})
