export type AuthUser = {
	id: string
	email: string
	name: string
	emailVerified: boolean
}

export type AuthSession = {
	id: string
	userId: string
	expiresAt: Date
	user: AuthUser
}
