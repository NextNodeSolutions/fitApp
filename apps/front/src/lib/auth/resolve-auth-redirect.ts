import { ROUTES } from '../routes'

import { PROTECTED_PATHS } from './protected-paths'

const GUEST_PATHS = [ROUTES.login, ROUTES.signup] as const

function matchesPath(pathname: string, base: string): boolean {
	return pathname === base || pathname.startsWith(`${base}/`)
}

export function resolveAuthRedirect(
	pathname: string,
	isAuthenticated: boolean,
): string | null {
	if (
		!isAuthenticated &&
		PROTECTED_PATHS.some(base => matchesPath(pathname, base))
	) {
		return ROUTES.login
	}
	if (
		isAuthenticated &&
		GUEST_PATHS.some(base => matchesPath(pathname, base))
	) {
		return ROUTES.dashboard
	}
	return null
}
