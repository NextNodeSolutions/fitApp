import {
	HTTP_BAD_REQUEST,
	HTTP_CREATED,
	HTTP_UNAUTHORIZED,
	ONBOARDING_UNAUTHORIZED_MESSAGE,
	OnboardingBodySchema,
	OnboardingCreatedResponseSchema,
	OnboardingErrorResponseSchema,
	OnboardingProfileNotFoundResponseSchema,
	OnboardingProfileResponseSchema,
	OnboardingUnauthorizedResponseSchema,
} from '@fitapp/contracts'
import { Hono } from 'hono'
import { describeRoute, resolver, validator } from 'hono-openapi'

import { createProfile } from '../application/create-profile'
import { getProfile } from '../application/get-profile'

import type { ProfileRepository } from '../ports/profile-repository'

type OnboardingRoutes = Hono<{ Bindings: Env }>

export type OnboardingDeps = {
	createRepository: (db: D1Database) => ProfileRepository
	generateSessionId: () => string
	generateApiToken: () => string
	getUserId: (env: Env, headers: Headers) => Promise<string | null>
}

const describeCreateProfileRoute = describeRoute({
	summary: 'Create onboarding profile',
	tags: ['Onboarding'],
	security: [{ cookieAuth: [] }],
	responses: {
		201: {
			description: 'Profile created',
			content: {
				'application/json': {
					schema: resolver(OnboardingCreatedResponseSchema),
				},
			},
		},
		400: {
			description: 'Invalid body',
			content: {
				'application/json': {
					schema: resolver(OnboardingErrorResponseSchema),
				},
			},
		},
		401: {
			description: 'Missing session',
			content: {
				'application/json': {
					schema: resolver(OnboardingUnauthorizedResponseSchema),
				},
			},
		},
	},
})

const describeGetProfileRoute = describeRoute({
	summary: 'Get onboarding profile',
	tags: ['Onboarding'],
	parameters: [
		{
			name: 'sessionId',
			in: 'path',
			required: true,
			schema: { type: 'string' },
		},
	],
	responses: {
		200: {
			description: 'Profile found',
			content: {
				'application/json': {
					schema: resolver(OnboardingProfileResponseSchema),
				},
			},
		},
		404: {
			description: 'Profile not found',
			content: {
				'application/json': {
					schema: resolver(OnboardingProfileNotFoundResponseSchema),
				},
			},
		},
	},
})

const validateOnboardingBody = validator(
	'json',
	OnboardingBodySchema,
	(parseResult, res) => {
		if (parseResult.success) return
		return res.json(
			{ errors: parseResult.error.map(issue => issue.message) },
			HTTP_BAD_REQUEST,
		)
	},
)

export function createOnboardingRoutes(deps: OnboardingDeps): OnboardingRoutes {
	const routes = new Hono<{ Bindings: Env }>()
	registerCreateProfileRoute(routes, deps)
	registerGetProfileRoute(routes, deps)
	return routes
}

function registerCreateProfileRoute(
	routes: OnboardingRoutes,
	deps: OnboardingDeps,
): void {
	routes.post(
		'/',
		describeCreateProfileRoute,
		validateOnboardingBody,
		async res => {
			const userId = await deps.getUserId(res.env, res.req.raw.headers)
			if (!userId) {
				return res.json(
					{ error: ONBOARDING_UNAUTHORIZED_MESSAGE },
					HTTP_UNAUTHORIZED,
				)
			}
			const body = res.req.valid('json')
			const profile = await createProfile(
				{
					repository: deps.createRepository(res.env.DB),
					generateSessionId: deps.generateSessionId,
					generateApiToken: deps.generateApiToken,
					userId,
				},
				body,
			)
			return res.json(
				{ profile: body, sessionId: profile.sessionId },
				HTTP_CREATED,
			)
		},
	)
}

function registerGetProfileRoute(
	routes: OnboardingRoutes,
	deps: OnboardingDeps,
): void {
	routes.get('/:sessionId', describeGetProfileRoute, async res => {
		const { sessionId } = res.req.param()
		const profile = await getProfile(
			{ repository: deps.createRepository(res.env.DB) },
			sessionId,
		)
		return res.json({ profile })
	})
}
