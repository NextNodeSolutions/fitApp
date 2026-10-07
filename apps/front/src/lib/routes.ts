export const ROUTES = {
	home: '/',
	login: '/login',
	signup: '/signup',
	onboarding: '/onboarding',
	dashboard: '/dashboard',
	weight: '/poids',
	settings: '/parametres',
} as const

// Front API routes: proxies to the API worker, which owns authentication.
export const API_PATH_PREFIX = '/api/'
