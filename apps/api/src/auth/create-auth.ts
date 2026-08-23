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
	return betterAuth({
		secret: env.BETTER_AUTH_SECRET,
		baseURL: env.SITE_URL,
		basePath: AUTH_BASE_PATH,
		trustedOrigins: [env.SITE_URL],
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
