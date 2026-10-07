import { defineMiddleware } from 'astro:middleware'

import { env } from 'cloudflare:workers'

// Initialize Sentry before any route, including API routes that render no page.
// oxlint-disable-next-line import/no-unassigned-import
import '../sentry.server.config'

import { getSession } from './lib/auth/get-session'
import { resolveAuthRedirect } from './lib/auth/resolve-auth-redirect'

export const onRequest = defineMiddleware(async (context, next) => {
	const { locals } = context
	locals.user = null
	locals.session = null
	// Prerendered pages (the landing) are built once, without a visitor session.
	if (context.isPrerendered) return next()
	const session = await getSession(env, context.request.headers.get('cookie'))
	if (session) {
		locals.user = session.user
		locals.session = session.session
	}
	const redirect = resolveAuthRedirect(context.url.pathname, session !== null)
	if (redirect) return context.redirect(redirect)
	return next()
})
