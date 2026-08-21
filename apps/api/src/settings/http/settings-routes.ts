import {
	HTTP_OK,
	HTTP_UNAUTHORIZED,
	SETTINGS_UNAUTHORIZED_MESSAGE,
	SettingsTokenResponseSchema,
	SettingsUnauthorizedResponseSchema,
} from '@fitapp/contracts'
import { Hono } from 'hono'
import { describeRoute, resolver } from 'hono-openapi'

import { getApiToken } from '../application/get-api-token'

import type { ApiTokenRepository } from '../ports/api-token-repository'

export type SettingsDeps = {
	createRepository: (db: D1Database) => ApiTokenRepository
	getUserId: (env: Env, headers: Headers) => Promise<string | null>
}

const describeSettingsTokenRoute = describeRoute({
	summary: 'Get current API token',
	tags: ['Settings'],
	security: [{ cookieAuth: [] }],
	responses: {
		200: {
			description: 'API token for the current user',
			content: {
				'application/json': {
					schema: resolver(SettingsTokenResponseSchema),
				},
			},
		},
		401: {
			description: 'Missing session',
			content: {
				'application/json': {
					schema: resolver(SettingsUnauthorizedResponseSchema),
				},
			},
		},
	},
})

export function createSettingsRoutes(
	deps: SettingsDeps,
): Hono<{ Bindings: Env }> {
	const routes = new Hono<{ Bindings: Env }>()
	routes.get('/token', describeSettingsTokenRoute, async res => {
		const userId = await deps.getUserId(res.env, res.req.raw.headers)
		if (!userId) {
			return res.json(
				{ error: SETTINGS_UNAUTHORIZED_MESSAGE },
				HTTP_UNAUTHORIZED,
			)
		}
		const token = await getApiToken(
			deps.createRepository(res.env.DB),
			userId,
		)
		return res.json({ token }, HTTP_OK)
	})
	return routes
}
