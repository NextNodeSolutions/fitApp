import { sentry } from '@sentry/hono/cloudflare'
import { Hono } from 'hono'

import { handleAppError } from './handle-app-error'

// Sentry must be the first middleware: it captures unhandled errors from Hono's
// onError chain (4xx responses are excluded) and builds a trace per request.
// The DSN comes from the SENTRY_DSN secret - without it the SDK stays disabled.
export function createHttpApp(): Hono<{ Bindings: Env }> {
	const app = new Hono<{ Bindings: Env }>()
	app.use(
		sentry(app, env => ({
			dsn: env.SENTRY_DSN,
			tracesSampleRate: 1.0,
		})),
	)
	app.onError(handleAppError)
	return app
}
