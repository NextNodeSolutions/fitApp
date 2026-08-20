const PROTECTED_PATHS = ['/dashboard', '/onboarding', '/parametres'] as const
const GUEST_PATHS = ['/login', '/signup'] as const

const LOGIN_PATH = '/login'
const DASHBOARD_PATH = '/dashboard'

function matchesPath(pathname: string, base: string): boolean {
	return pathname === base || pathname.startsWith(`${base}/`)
}

export function isAuthGuardedPath(pathname: string): boolean {
	return (
		PROTECTED_PATHS.some(base => matchesPath(pathname, base)) ||
		GUEST_PATHS.some(base => matchesPath(pathname, base))
	)
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
