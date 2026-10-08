import { AUTH_BASE_PATH } from '@fitapp/contracts'

import { getUserId } from './auth/get-user-id'
import { createAuthRoutes } from './auth/http/auth-routes'
import { mountApiDocumentation } from './docs/api-documentation'
import { createHealthRoutes } from './health/http/health-routes'
import { createHttpApp } from './http/create-http-app'
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

const app = createHttpApp()

app.route('/healthz', createHealthRoutes())

app.route(AUTH_BASE_PATH, createAuthRoutes())

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
