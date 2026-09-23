import * as Sentry from '@sentry/astro'
import { env } from 'cloudflare:workers'

// Imported by middleware before any route, including API routes that render no page.
// The integration's default init reads a build-time DSN; this uses the Worker secret.
// Without SENTRY_DSN the SDK stays disabled.
Sentry.init({
	dsn: env.SENTRY_DSN,
	tracesSampleRate: 1.0,
})
