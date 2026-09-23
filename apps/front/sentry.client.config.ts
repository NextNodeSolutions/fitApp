import * as Sentry from '@sentry/astro'

// Browser-side Sentry. The DSN is a build-time env var (PUBLIC_SENTRY_DSN) -
// it is public by design; without it the SDK stays disabled.
Sentry.init({
	dsn: import.meta.env.PUBLIC_SENTRY_DSN,
	integrations: [Sentry.browserTracingIntegration()],
	tracesSampleRate: 1.0,
})
