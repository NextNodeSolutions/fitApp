import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { AUTH_BASE_PATH, PASSWORD_MIN_LENGTH } from '@fitapp/contracts'
import { betterAuth } from 'better-auth/minimal'
import { openAPI } from 'better-auth/plugins'

import { db } from '../db'
import * as schema from '../db/schema'

// Origins allowed to drive auth through the front's service-binding proxy.
// The infra-injected SITE_URL is the project's canonical domain (nextnode.fr),
// which is not the front's public host, so the allowlist is declared here.
const TRUSTED_ORIGINS = [
	'https://front-fitapp.nextnode.fr',
	'https://dev.front-fitapp.nextnode.fr',
	// Local dev: front on Astro (http), proxied to the local api worker.
	'http://localhost:4321',
]

export type Auth = {
	handler: (request: Request) => Promise<Response>
	api: {
		getSession: (context: { headers: Headers }) => Promise<unknown>
	}
}

export function createAuth(env: Env): Auth {
	return betterAuth({
		secret: env.BETTER_AUTH_SECRET,
		baseURL: env.SITE_URL,
		basePath: AUTH_BASE_PATH,
		trustedOrigins: [...TRUSTED_ORIGINS],
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
