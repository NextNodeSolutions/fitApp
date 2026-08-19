import {
	HTTP_BAD_REQUEST,
	HTTP_CREATED,
	HTTP_NOT_FOUND,
	OnboardingBodySchema,
	PROFILE_NOT_FOUND_ERROR,
} from '@fitapp/contracts'
import { vValidator } from '@hono/valibot-validator'
import { Hono } from 'hono'

import { createProfile } from '../application/create-profile'
import { getProfile } from '../application/get-profile'

import type { ProfileRepository } from '../ports/profile-repository'

export type OnboardingDeps = {
	createRepository: (db: D1Database) => ProfileRepository
	generateSessionId: () => string
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
			const body = res.req.valid('json')
			const profile = await createProfile(
				{
					repository: deps.createRepository(res.env.DB),
					generateSessionId: deps.generateSessionId,
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

		if (!profile) {
			return res.json(
				{ errors: [PROFILE_NOT_FOUND_ERROR] },
				HTTP_NOT_FOUND,
			)
		}

		return res.json({ profile })
	})

	return onboarding
}
