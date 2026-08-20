import {
	HTTP_OK,
	HTTP_UNAUTHORIZED,
	SETTINGS_UNAUTHORIZED_MESSAGE,
} from '@fitapp/contracts'
import { Hono } from 'hono'

import { getApiToken } from '../application/get-api-token'

import type { ApiTokenRepository } from '../ports/api-token-repository'

export type SettingsDeps = {
	createRepository: (db: D1Database) => ApiTokenRepository
	getUserId: (env: Env, headers: Headers) => Promise<string | null>
}

export function createSettingsRoutes(
	deps: SettingsDeps,
): Hono<{ Bindings: Env }> {
	const routes = new Hono<{ Bindings: Env }>()
	routes.get('/token', async res => {
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
