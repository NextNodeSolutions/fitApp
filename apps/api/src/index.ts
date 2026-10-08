import { AUTH_BASE_PATH, AppError } from '@fitapp/contracts'
import { sentry } from '@sentry/hono/cloudflare'
import { Hono } from 'hono'

import { getAuthSession } from './auth/get-auth-session'
import { createAuthRoutes } from './auth/http/auth-routes'
import { mountApiDocumentation } from './docs/api-documentation'
import { createHealthRoutes } from './health/http/health-routes'
import { createIngestRoutes } from './ingest/http/ingest-routes'
import { createD1IngestRepository } from './ingest/infrastructure/d1-ingest-repository'
import { createD1MealRepository } from './meals/infrastructure/d1-meal-repository'
import { createOnboardingRoutes } from './onboarding/http/onboarding-routes'
import { createD1ProfileRepository } from './onboarding/infrastructure/d1-profile-repository'
import { generateApiToken } from './onboarding/infrastructure/generate-api-token'
import { createApiRpc } from './rpc/create-api-rpc'
import { createSettingsRoutes } from './settings/http/settings-routes'
import { createD1ApiTokenRepository } from './settings/infrastructure/d1-api-token-repository'
import { createD1SettingsAccountRepository } from './settings/infrastructure/d1-settings-account-repository'
import { createD1SettingsProfileRepository } from './settings/infrastructure/d1-settings-profile-repository'
import { createWeightRoutes } from './weight/http/weight-routes'
import { createD1WeightRepository } from './weight/infrastructure/d1-weight-repository'

const app = new Hono<{ Bindings: Env }>()

// Sentry must be the first middleware: it captures unhandled errors from Hono's
// onError chain (4xx responses are excluded) and builds a trace per request.
// The DSN comes from the SENTRY_DSN secret - without it the SDK stays disabled.
app.use(
	sentry(app, env => ({
		dsn: env.SENTRY_DSN,
		tracesSampleRate: 1.0,
	})),
)

app.route('/healthz', createHealthRoutes())

app.onError((error, res) => {
	if (error instanceof AppError && error.status) {
		return res.json(error.toJSON(), error.status)
	}
	throw error
})

app.route(AUTH_BASE_PATH, createAuthRoutes())

const getUserId = async (
	env: Env,
	headers: Headers,
): Promise<string | null> => {
	const authSession = await getAuthSession(env, headers)
	return authSession?.user.id ?? null
}

app.route(
	'/api/onboarding',
	createOnboardingRoutes({
		createRepository: createD1ProfileRepository,
		generateSessionId: () => crypto.randomUUID(),
		generateApiToken,
		getUserId,
	}),
)
app.route(
	'/api/ingest',
	createIngestRoutes({ createRepository: createD1IngestRepository }),
)
app.route(
	'/api/settings',
	createSettingsRoutes({
		createRepository: createD1ApiTokenRepository,
		createProfileRepository: createD1SettingsProfileRepository,
		createAccountRepository: createD1SettingsAccountRepository,
		getUserId,
	}),
)
app.route(
	'/api/weight',
	createWeightRoutes({
		createRepository: createD1WeightRepository,
		getUserId,
	}),
)
mountApiDocumentation(app)

const apiRpc = createApiRpc({
	createProfileRepository: createD1SettingsProfileRepository,
	createApiTokenRepository: createD1ApiTokenRepository,
	createWeightRepository: createD1WeightRepository,
	createMealRepository: createD1MealRepository,
})

// The Worker entry (worker.ts) serves both: HTTP through app, RPC through apiRpc.
export { apiRpc, app }
