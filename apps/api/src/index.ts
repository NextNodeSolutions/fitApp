import { AppError } from '@fitapp/contracts'
import { Hono } from 'hono'

import { createOnboardingRoutes } from './onboarding/http/onboarding-routes'
import { createD1ProfileRepository } from './onboarding/infrastructure/d1-profile-repository'

const app = new Hono<{ Bindings: Env }>()

app.get('/healthz', res => res.json({ status: 'ok', service: 'api' }))

app.onError((error, res) => {
	if (error instanceof AppError && error.status) {
		return res.json(error.toJSON(), error.status)
	}
	throw error
})

app.route(
	'/api/onboarding',
	createOnboardingRoutes({
		createRepository: createD1ProfileRepository,
		generateSessionId: () => crypto.randomUUID(),
	}),
)

export { app }

// oxlint-disable-next-line import/no-default-export
export default { fetch: app.fetch } satisfies ExportedHandler<Env>
