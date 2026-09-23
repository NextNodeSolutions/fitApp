import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { AUTH_BASE_PATH, PASSWORD_MIN_LENGTH } from '@fitapp/contracts'
import { betterAuth } from 'better-auth/minimal'
import { openAPI } from 'better-auth/plugins'

import { db } from '../db'
import * as schema from '../db/schema'

export type Auth = {
	handler: (request: Request) => Promise<Response>
	api: {
		getSession: (context: { headers: Headers }) => Promise<unknown>
	}
}

export function createAuth(env: Env): Auth {
	// The infra injects only SITE_URL on the Workers target (no sibling URLs),
	// and the front lives on a subdomain of the project domain
	// (front-fitapp.nextnode.fr for domain nextnode.fr). Trust the site origin
	// itself plus any of its subdomains, never a hardcoded hostname. In local
	// dev SITE_URL is http://localhost:4321, which is the proxied origin.
	const site = new URL(env.SITE_URL)

	return betterAuth({
		secret: env.BETTER_AUTH_SECRET,
		baseURL: env.SITE_URL,
		basePath: AUTH_BASE_PATH,
		trustedOrigins: [site.origin, `*.${site.hostname}`],
		database: drizzleAdapter(db(env.DB), {
			provider: 'sqlite',
			schema: {
				user: schema.user,
				session: schema.session,
				account: schema.account,
				verification: schema.verification,
			},
		}),
		emailAndPassword: {
			enabled: true,
			minPasswordLength: PASSWORD_MIN_LENGTH,
		},
		plugins: [openAPI({ disableDefaultReference: true })],
		advanced: {
			trustedProxyHeaders: true,
			defaultCookieAttributes: {
				path: '/',
				sameSite: 'lax',
			},
		},
	})
}
