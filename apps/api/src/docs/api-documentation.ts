import { AUTH_BASE_PATH } from '@fitapp/contracts'
import { Scalar } from '@scalar/hono-api-reference'
import { openAPIRouteHandler } from 'hono-openapi'

import type { Hono } from 'hono'

const APPLICATION_OPENAPI_PATH = '/openapi.json'
const AUTH_OPENAPI_PATH = `${AUTH_BASE_PATH}/open-api/generate-schema`

export function mountApiDocumentation(app: Hono<{ Bindings: Env }>): void {
	app.get(
		APPLICATION_OPENAPI_PATH,
		openAPIRouteHandler(app, {
			documentation: {
				openapi: '3.1.0',
				info: {
					title: 'FitApp API',
					version: '0.0.1',
				},
				components: {
					securitySchemes: {
						bearerAuth: {
							type: 'http',
							scheme: 'bearer',
						},
						cookieAuth: {
							type: 'apiKey',
							in: 'cookie',
							name: 'better-auth.session_token',
						},
					},
				},
			},
			exclude: [
				'/docs',
				APPLICATION_OPENAPI_PATH,
				new RegExp(`^${AUTH_BASE_PATH}`),
			],
		}),
	)
	app.get(
		'/docs',
		Scalar({
			pageTitle: 'FitApp API',
			sources: [
				{ url: APPLICATION_OPENAPI_PATH, title: 'Application' },
				{ url: AUTH_OPENAPI_PATH, title: 'Auth' },
			],
		}),
	)
}
