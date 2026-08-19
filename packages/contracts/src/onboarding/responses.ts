import * as v from 'valibot'

import { OnboardingBodySchema } from './body-schema'

export const OnboardingCreatedResponseSchema = v.object({
	profile: OnboardingBodySchema,
	sessionId: v.string(),
})

export const OnboardingErrorResponseSchema = v.object({
	errors: v.array(v.string()),
})

export type OnboardingCreatedResponse = v.InferOutput<
	typeof OnboardingCreatedResponseSchema
>
