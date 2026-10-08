import * as v from 'valibot'

import { UNAUTHORIZED_MESSAGE } from './constants'

export const UnauthorizedResponseSchema = v.object({
	error: v.literal(UNAUTHORIZED_MESSAGE),
})

export const ValidationErrorResponseSchema = v.object({
	errors: v.array(v.string()),
})

export type UnauthorizedResponse = v.InferOutput<
	typeof UnauthorizedResponseSchema
>
export type ValidationErrorResponse = v.InferOutput<
	typeof ValidationErrorResponseSchema
>
