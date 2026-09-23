import * as v from 'valibot'

export const BETTER_AUTH_USER_ALREADY_EXISTS_CODE = 'USER_ALREADY_EXISTS'

// Better Auth codes meaning the credentials themselves are wrong. Any other
// code (INVALID_ORIGIN, FAILED_TO_CREATE_USER, ...) is a server-side problem,
// not a credentials problem — it must not surface as a credentials error.
export const BETTER_AUTH_INVALID_CREDENTIALS_CODES = [
	'INVALID_EMAIL_OR_PASSWORD',
	'INVALID_EMAIL',
	'INVALID_PASSWORD',
	'USER_NOT_FOUND',
	'CREDENTIAL_ACCOUNT_NOT_FOUND',
] as const

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
