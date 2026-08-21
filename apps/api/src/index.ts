import { AUTH_BASE_PATH, AppError, HTTP_OK } from '@fitapp/contracts'
import { Hono } from 'hono'
import { describeRoute, resolver } from 'hono-openapi'
import * as v from 'valibot'

import { getAuthSession } from './auth/get-auth-session'
import { createAuthRoutes } from './auth/http/auth-routes'
import { mountApiDocumentation } from './docs/api-documentation'
import { createIngestRoutes } from './ingest/http/ingest-routes'
import { createD1IngestRepository } from './ingest/infrastructure/d1-ingest-repository'
import { createOnboardingRoutes } from './onboarding/http/onboarding-routes'
import { createD1ProfileRepository } from './onboarding/infrastructure/d1-profile-repository'
import { generateApiToken } from './onboarding/infrastructure/generate-api-token'
import { createSettingsRoutes } from './settings/http/settings-routes'
import { createD1ApiTokenRepository } from './settings/infrastructure/d1-api-token-repository'

const HealthzResponseSchema = v.object({
	status: v.literal('ok'),
	service: v.literal('api'),
})

const describeHealthzRoute = describeRoute({
	summary: 'Health check',
	tags: ['Health'],
	responses: {
		[HTTP_OK]: {
			description: 'Service is healthy',
			content: {
				'application/json': {
					schema: resolver(HealthzResponseSchema),
				},
			},
		},
	},
})

const app = new Hono<{ Bindings: Env }>()

app.get('/healthz', describeHealthzRoute, res =>
	res.json({ status: 'ok', service: 'api' }),
)

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
		getUserId,
	}),
)

mountApiDocumentation(app)

export { app }

// oxlint-disable-next-line import/no-default-export
export default { fetch: app.fetch } satisfies ExportedHandler<Env>
