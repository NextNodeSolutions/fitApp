import {
	HTTP_BAD_REQUEST,
	HTTP_NOT_FOUND,
	HTTP_OK,
	HTTP_UNAUTHORIZED,
	SETTINGS_PROFILE_NOT_FOUND_MESSAGE,
	SETTINGS_UNAUTHORIZED_MESSAGE,
	SettingsAccountDeletedResponseSchema,
	SettingsProfileBodySchema,
	SettingsProfileNotFoundResponseSchema,
	SettingsProfileResponseSchema,
	SettingsTokenResponseSchema,
	SettingsUnauthorizedResponseSchema,
	SettingsValidationErrorResponseSchema,
} from '@fitapp/contracts'
import { Hono } from 'hono'
import { describeRoute, resolver, validator } from 'hono-openapi'

import { deleteAccount } from '../application/delete-account'
import { getApiToken } from '../application/get-api-token'
import { getSettingsProfile } from '../application/get-settings-profile'
import { updateSettingsProfile } from '../application/update-settings-profile'

import type { AccountRepository } from '../ports/account-repository'
import type { ApiTokenRepository } from '../ports/api-token-repository'
import type { SettingsProfileRepository } from '../ports/settings-profile-repository'

export type SettingsDeps = {
	createRepository: (db: D1Database) => ApiTokenRepository
	createProfileRepository: (db: D1Database) => SettingsProfileRepository
	createAccountRepository: (db: D1Database) => AccountRepository
	getUserId: (env: Env, headers: Headers) => Promise<string | null>
}

const unauthorizedResponseSchema = resolver(SettingsUnauthorizedResponseSchema)
const notFoundResponseSchema = resolver(SettingsProfileNotFoundResponseSchema)
const validationResponseSchema = resolver(SettingsValidationErrorResponseSchema)

const describeSettingsTokenRoute = describeRoute({
	summary: 'Get current API token',
	tags: ['Settings'],
	security: [{ cookieAuth: [] }],
	responses: {
		[HTTP_OK]: {
			description: 'API token for the current user',
			content: {
				'application/json': {
					schema: resolver(SettingsTokenResponseSchema),
				},
			},
		},
		[HTTP_UNAUTHORIZED]: {
			description: 'Missing session',
			content: {
				'application/json': { schema: unauthorizedResponseSchema },
			},
		},
	},
})

const describeGetProfileRoute = describeRoute({
	summary: 'Get the current user profile',
	tags: ['Settings'],
	security: [{ cookieAuth: [] }],
	responses: {
		[HTTP_OK]: {
			description: 'User profile',
			content: {
				'application/json': {
					schema: resolver(SettingsProfileResponseSchema),
				},
			},
		},
		[HTTP_NOT_FOUND]: {
			description: 'No profile for the current user',
			content: { 'application/json': { schema: notFoundResponseSchema } },
		},
		[HTTP_UNAUTHORIZED]: {
			description: 'Missing session',
			content: {
				'application/json': { schema: unauthorizedResponseSchema },
			},
		},
	},
})

const describeUpdateProfileRoute = describeRoute({
	summary: 'Update the current user profile',
	tags: ['Settings'],
	security: [{ cookieAuth: [] }],
	responses: {
		[HTTP_OK]: {
			description: 'Updated user profile',
			content: {
				'application/json': {
					schema: resolver(SettingsProfileResponseSchema),
				},
			},
		},
		[HTTP_BAD_REQUEST]: {
			description: 'Invalid body',
			content: {
				'application/json': { schema: validationResponseSchema },
			},
		},
		[HTTP_NOT_FOUND]: {
			description: 'No profile for the current user',
			content: { 'application/json': { schema: notFoundResponseSchema } },
		},
		[HTTP_UNAUTHORIZED]: {
			description: 'Missing session',
			content: {
				'application/json': { schema: unauthorizedResponseSchema },
			},
		},
	},
})

const describeDeleteAccountRoute = describeRoute({
	summary: 'Delete the current user account and all related data',
	tags: ['Settings'],
	security: [{ cookieAuth: [] }],
	responses: {
		[HTTP_OK]: {
			description: 'Account deleted',
			content: {
				'application/json': {
					schema: resolver(SettingsAccountDeletedResponseSchema),
				},
			},
		},
		[HTTP_UNAUTHORIZED]: {
			description: 'Missing session',
			content: {
				'application/json': { schema: unauthorizedResponseSchema },
			},
		},
	},
})

const validateSettingsProfileBody = validator(
	'json',
	SettingsProfileBodySchema,
	(parseResult, res) => {
		if (parseResult.success) return
		return res.json(
			{ errors: parseResult.error.map(issue => issue.message) },
			HTTP_BAD_REQUEST,
		)
	},
)

export function createSettingsRoutes(
	deps: SettingsDeps,
): Hono<{ Bindings: Env }> {
	const routes = new Hono<{ Bindings: Env }>()
	registerSettingsTokenRoute(routes, deps)
	registerGetProfileRoute(routes, deps)
	registerUpdateProfileRoute(routes, deps)
	registerDeleteAccountRoute(routes, deps)
	return routes
}

function registerSettingsTokenRoute(
	routes: Hono<{ Bindings: Env }>,
	deps: SettingsDeps,
): void {
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
}

function registerGetProfileRoute(
	routes: Hono<{ Bindings: Env }>,
	deps: SettingsDeps,
): void {
	routes.get('/profile', describeGetProfileRoute, async res => {
		const userId = await deps.getUserId(res.env, res.req.raw.headers)
		if (!userId) {
			return res.json(
				{ error: SETTINGS_UNAUTHORIZED_MESSAGE },
				HTTP_UNAUTHORIZED,
			)
		}
		const profile = await getSettingsProfile(
			deps.createProfileRepository(res.env.DB),
			userId,
		)
		if (!profile) {
			return res.json(
				{ error: SETTINGS_PROFILE_NOT_FOUND_MESSAGE },
				HTTP_NOT_FOUND,
			)
		}
		return res.json({ profile }, HTTP_OK)
	})
}

function registerUpdateProfileRoute(
	routes: Hono<{ Bindings: Env }>,
	deps: SettingsDeps,
): void {
	routes.patch(
		'/profile',
		describeUpdateProfileRoute,
		validateSettingsProfileBody,
		async res => {
			const userId = await deps.getUserId(res.env, res.req.raw.headers)
			if (!userId) {
				return res.json(
					{ error: SETTINGS_UNAUTHORIZED_MESSAGE },
					HTTP_UNAUTHORIZED,
				)
			}
			const patch = res.req.valid('json')
			const profile = await updateSettingsProfile(
				deps.createProfileRepository(res.env.DB),
				userId,
				patch,
			)
			if (!profile) {
				return res.json(
					{ error: SETTINGS_PROFILE_NOT_FOUND_MESSAGE },
					HTTP_NOT_FOUND,
				)
			}
			return res.json({ profile }, HTTP_OK)
		},
	)
}

function registerDeleteAccountRoute(
	routes: Hono<{ Bindings: Env }>,
	deps: SettingsDeps,
): void {
	routes.delete('/account', describeDeleteAccountRoute, async res => {
		const userId = await deps.getUserId(res.env, res.req.raw.headers)
		if (!userId) {
			return res.json(
				{ error: SETTINGS_UNAUTHORIZED_MESSAGE },
				HTTP_UNAUTHORIZED,
			)
		}
		await deleteAccount(deps.createAccountRepository(res.env.DB), userId)
		return res.json({ ok: true }, HTTP_OK)
	})
}
