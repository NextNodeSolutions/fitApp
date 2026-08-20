import { defineMiddleware } from 'astro:middleware'

import { env } from 'cloudflare:workers'

import { getSession } from './lib/auth/get-session'
import { resolveAuthRedirect } from './lib/auth/resolve-auth-redirect'

export const onRequest = defineMiddleware(async (context, next) => {
	const { locals } = context
	locals.user = null
	locals.session = null
	const session = await getSession(env, context.request.headers.get('cookie'))
	if (session) {
		locals.user = session.user
		locals.session = session.session
	}
	const redirect = resolveAuthRedirect(context.url.pathname, session !== null)
	if (redirect) return context.redirect(redirect)
	return next()
})
