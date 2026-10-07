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

const FRONT_HOST = 'front-fitapp.nextnode.fr'
const API_HOST = 'api-fitapp.nextnode.fr'
// Must stay byte-equal to API_ORIGIN in apps/front/src/lib/api.ts: the service
// binding subrequest's Host header is this dummy origin
const PROXY_BINDING_HOST = 'api.internal'
const LOCAL_HOST = 'localhost:4321'

const DEPLOYED_HOSTS = ['', 'dev.'].flatMap(prefix => [
	`${prefix}${FRONT_HOST}`,
	`${prefix}${API_HOST}`,
])
const TRUSTED_HOSTS = [...DEPLOYED_HOSTS, PROXY_BINDING_HOST, LOCAL_HOST]
const trustedOrigins = DEPLOYED_HOSTS.concat(LOCAL_HOST).map(
	host => `${host === LOCAL_HOST ? 'http' : 'https'}://${host}`,
)

export function createAuth(env: Env): Auth {
	// Infra injects only SITE_URL, the services' own urls never travel to the
	// worker: hosts above mirror nextnode.toml's [deploy.services.*].url values
	return betterAuth({
		secret: env.BETTER_AUTH_SECRET,
		// fallback: an unknown host silently resolves to SITE_URL (hides a misconfig
		// instead of failing loudly) so auth keeps working on an unexpected host
		baseURL: {
			allowedHosts: TRUSTED_HOSTS,
			protocol: 'auto',
			fallback: env.SITE_URL,
		},
		basePath: AUTH_BASE_PATH,
		trustedOrigins,
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
