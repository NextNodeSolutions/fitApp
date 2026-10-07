import { HTTP_OK } from '@fitapp/contracts'
import { Hono } from 'hono'
import { describeRoute, resolver } from 'hono-openapi'
import * as v from 'valibot'

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

export function createHealthRoutes(): Hono<{ Bindings: Env }> {
	const routes = new Hono<{ Bindings: Env }>()
	routes.get('/', describeHealthzRoute, res =>
		res.json({ status: 'ok', service: 'api' }),
	)
	return routes
}
