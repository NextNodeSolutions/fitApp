import { ApiError } from './errors/api-error'

export function fetchFromApi(
	env: Pick<Env, 'API'>,
	path: string,
	init?: RequestInit,
): Promise<Response> {
	return env.API.fetch(path, init)
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
