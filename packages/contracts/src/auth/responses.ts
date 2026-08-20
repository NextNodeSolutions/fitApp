import * as v from 'valibot'

export const AuthUserSchema = v.object({
	id: v.string(),
	name: v.string(),
	email: v.string(),
	emailVerified: v.boolean(),
	image: v.optional(v.nullable(v.string())),
})

export const AuthSessionSchema = v.object({
	id: v.string(),
	userId: v.string(),
	token: v.optional(v.string()),
	expiresAt: v.union([v.string(), v.date()]),
})

export const AuthSessionResponseSchema = v.object({
	user: AuthUserSchema,
	session: AuthSessionSchema,
})

export const AuthSuccessResponseSchema = v.object({
	user: AuthUserSchema,
	token: v.optional(v.nullable(v.string())),
})

export const AuthErrorResponseSchema = v.object({
	code: v.optional(v.string()),
	message: v.string(),
})

export type AuthUser = v.InferOutput<typeof AuthUserSchema>
export type AuthSession = v.InferOutput<typeof AuthSessionSchema>
export type AuthSessionResponse = v.InferOutput<
	typeof AuthSessionResponseSchema
>
export type AuthSuccessResponse = v.InferOutput<
	typeof AuthSuccessResponseSchema
>
export type AuthErrorResponse = v.InferOutput<typeof AuthErrorResponseSchema>
