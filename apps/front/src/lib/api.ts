import { ApiError } from './errors/api-error'

// Dummy origin: Fetcher ignores the host; the Fetch API still requires an absolute URL.
const API_ORIGIN = 'https://api.internal'

export function fetchFromApi(
	env: Pick<Env, 'API'>,
	path: string,
	init?: RequestInit,
): Promise<Response> {
	return env.API.fetch(new URL(path, API_ORIGIN), init)
}

export async function getApiJson(
	env: Pick<Env, 'API'>,
	path: string,
	init?: RequestInit,
): Promise<unknown> {
	const response = await fetchFromApi(env, path, init)
	if (!response.ok) {
		throw new ApiError(path, response.status)
	}
	return response.json()
}
