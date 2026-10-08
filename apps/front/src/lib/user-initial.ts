import type { AuthUser } from '@fitapp/contracts'

const FALLBACK_INITIAL = '·'

export function userInitial(
	user: Pick<AuthUser, 'name' | 'email'> | null,
): string {
	const source = user?.name.trim() || user?.email || ''
	return source.charAt(0).toLocaleUpperCase('fr-FR') || FALLBACK_INITIAL
}
