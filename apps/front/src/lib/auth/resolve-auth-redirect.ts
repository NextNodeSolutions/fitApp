import { PROTECTED_PATHS } from './protected-paths'

const LOGIN_PATH = '/login'
const SIGNUP_PATH = '/signup'
const DASHBOARD_PATH = '/dashboard'
const GUEST_PATHS = [LOGIN_PATH, SIGNUP_PATH] as const

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
		return LOGIN_PATH
	}
	if (
		isAuthenticated &&
		GUEST_PATHS.some(base => matchesPath(pathname, base))
	) {
		return DASHBOARD_PATH
	}
	return null
}
