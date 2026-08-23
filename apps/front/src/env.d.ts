import type { AuthSession, AuthUser } from '@fitapp/contracts'

declare module 'cloudflare:workers' {
	export const env: Env
}

declare global {
	namespace App {
		interface Locals {
			user: AuthUser | null
			session: AuthSession | null
		}
	}
}
