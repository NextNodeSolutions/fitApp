import * as v from 'valibot'

import { ProfileNotFoundError } from '../errors'

import { OnboardingBodySchema } from './body-schema'
import { ONBOARDING_UNAUTHORIZED_MESSAGE } from './constants'

export const OnboardingCreatedResponseSchema = v.object({
	profile: OnboardingBodySchema,
	sessionId: v.string(),
})

export const OnboardingErrorResponseSchema = v.object({
	errors: v.array(v.string()),
})

export const OnboardingUnauthorizedResponseSchema = v.object({
	error: v.literal(ONBOARDING_UNAUTHORIZED_MESSAGE),
})

export const OnboardingProfileResponseSchema = v.object({
	profile: v.object({
		...OnboardingBodySchema.entries,
		sessionId: v.string(),
	}),
})

const profileNotFoundError = new ProfileNotFoundError()

export const OnboardingProfileNotFoundResponseSchema = v.object({
	code: v.literal(profileNotFoundError.code),
	message: v.literal(profileNotFoundError.message),
})

export type OnboardingCreatedResponse = v.InferOutput<
	typeof OnboardingCreatedResponseSchema
>

export type OnboardingUnauthorizedResponse = v.InferOutput<
	typeof OnboardingUnauthorizedResponseSchema
>

export type OnboardingProfileResponse = v.InferOutput<
	typeof OnboardingProfileResponseSchema
>

export type OnboardingProfileNotFoundResponse = v.InferOutput<
	typeof OnboardingProfileNotFoundResponseSchema
>
