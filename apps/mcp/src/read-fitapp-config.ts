// Adapter signature for reaching the FitApp API: stdio uses global fetch
// against the production origin, the remote worker uses the API service
// binding (which ignores the URL host).
export type ApiFetch = (path: string, init?: RequestInit) => Promise<Response>

export type FitAppConfig = {
	apiToken: string
	apiFetch: ApiFetch
}

// Stdio runs outside the Workers runtime: no service binding exists, so the
// production origin is the default target. Override FITAPP_API_ORIGIN to talk
// to another environment (e.g. a local wrangler dev).
const DEFAULT_FITAPP_API_ORIGIN = 'https://api-fitapp.nextnode.fr'

export function readFitAppConfig(): FitAppConfig {
	const apiToken = process.env.FITAPP_API_TOKEN?.trim()
	if (!apiToken) {
		throw new Error(
			'FITAPP_API_TOKEN est manquant. Définis FITAPP_API_TOKEN avec ton jeton API FitApp.',
		)
	}
	const origin =
		process.env.FITAPP_API_ORIGIN?.trim() || DEFAULT_FITAPP_API_ORIGIN
	return { apiFetch: globalFetchTo(origin), apiToken }
}

function globalFetchTo(origin: string): ApiFetch {
	return (path, init) => fetch(new URL(path, origin), init)
}
