import * as v from 'valibot'

import { ProfileNotFoundError } from '../errors'

import { OnboardingBodySchema } from './body-schema'

export const OnboardingCreatedResponseSchema = v.object({
	profile: OnboardingBodySchema,
	sessionId: v.string(),
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

export type OnboardingProfileResponse = v.InferOutput<
	typeof OnboardingProfileResponseSchema
>

export type OnboardingProfileNotFoundResponse = v.InferOutput<
	typeof OnboardingProfileNotFoundResponseSchema
>
