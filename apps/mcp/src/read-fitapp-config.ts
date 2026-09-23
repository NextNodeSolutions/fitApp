// Adapter signature for reaching the FitApp API: stdio uses global fetch
// against the production origin, the remote worker uses the API service
// binding (which ignores the URL host).
export type ApiFetch = (path: string, init?: RequestInit) => Promise<Response>

export type FitAppConfig = {
	apiToken: string
	apiFetch: ApiFetch
}

const FITAPP_API_ORIGIN = 'https://api-fitapp.nextnode.fr'

export function readFitAppConfig(): FitAppConfig {
	const apiToken = process.env.FITAPP_API_TOKEN?.trim()
	if (!apiToken) {
		throw new Error(
			'FITAPP_API_TOKEN est manquant. Définis FITAPP_API_TOKEN avec ton jeton API FitApp.',
		)
	}
	return { apiToken, apiFetch: globalFetchTo(FITAPP_API_ORIGIN) }
}

function globalFetchTo(origin: string): ApiFetch {
	return (path, init) => fetch(new URL(path, origin), init)
}
