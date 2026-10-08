import {
	HTTP_BAD_REQUEST,
	HTTP_CREATED,
	HTTP_OK,
	HTTP_UNAUTHORIZED,
	OnboardingBodySchema,
	OnboardingCreatedResponseSchema,
	OnboardingProfileNotFoundResponseSchema,
	OnboardingProfileResponseSchema,
	UnauthorizedResponseSchema,
	ValidationErrorResponseSchema,
} from '@fitapp/contracts'
import { Hono } from 'hono'
import { describeRoute, resolver, validator } from 'hono-openapi'

import { requireUserId } from '../../auth/http/require-user-id'
import { rejectInvalidInput } from '../../http/reject-invalid-input'
import { createProfile } from '../application/create-profile'
import { getProfile } from '../application/get-profile'

import type { GetUserId } from '../../auth/http/require-user-id'
import type { ProfileRepository } from '../ports/profile-repository'

type OnboardingRoutes = Hono<{ Bindings: Env }>

export type OnboardingDeps = {
	createRepository: (db: D1Database) => ProfileRepository
	generateSessionId: () => string
	generateApiToken: () => string
	getUserId: GetUserId
}

const describeCreateProfileRoute = describeRoute({
	summary: 'Create onboarding profile',
	tags: ['Onboarding'],
	security: [{ cookieAuth: [] }],
	responses: {
		[HTTP_CREATED]: {
			description: 'Profile created',
			content: {
				'application/json': {
					schema: resolver(OnboardingCreatedResponseSchema),
				},
			},
		},
		[HTTP_BAD_REQUEST]: {
			description: 'Invalid body',
			content: {
				'application/json': {
					schema: resolver(ValidationErrorResponseSchema),
				},
			},
		},
		[HTTP_UNAUTHORIZED]: {
			description: 'Missing session',
			content: {
				'application/json': {
					schema: resolver(UnauthorizedResponseSchema),
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
		[HTTP_OK]: {
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
	rejectInvalidInput,
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
		requireUserId(deps.getUserId),
		async res => {
			const userId = res.get('userId')
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
