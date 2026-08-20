import {
	HTTP_BAD_REQUEST,
	HTTP_CREATED,
	HTTP_UNAUTHORIZED,
	ONBOARDING_UNAUTHORIZED_MESSAGE,
	OnboardingBodySchema,
} from '@fitapp/contracts'
import { vValidator } from '@hono/valibot-validator'
import { Hono } from 'hono'

import { createProfile } from '../application/create-profile'
import { getProfile } from '../application/get-profile'

import type { ProfileRepository } from '../ports/profile-repository'

export type OnboardingDeps = {
	createRepository: (db: D1Database) => ProfileRepository
	generateSessionId: () => string
	generateApiToken: () => string
	getUserId: (env: Env, headers: Headers) => Promise<string | null>
}

export function createOnboardingRoutes(deps: OnboardingDeps): Hono<{
	Bindings: Env
}> {
	const onboarding = new Hono<{ Bindings: Env }>()

	onboarding.post(
		'/',
		vValidator('json', OnboardingBodySchema, (parseResult, res) => {
			if (parseResult.success) return
			return res.json(
				{ errors: parseResult.issues.map(issue => issue.message) },
				HTTP_BAD_REQUEST,
			)
		}),
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

	onboarding.get('/:sessionId', async res => {
		const { sessionId } = res.req.param()
		const profile = await getProfile(
			{ repository: deps.createRepository(res.env.DB) },
			sessionId,
		)

		return res.json({ profile })
	})

	return onboarding
}
