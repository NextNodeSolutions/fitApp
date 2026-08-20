import { AUTH_BASE_PATH } from '@fitapp/contracts'

import { fetchFromApi } from '../api'

const FORWARDED_REQUEST_HEADERS = ['content-type', 'cookie', 'origin'] as const
const BODILESS_METHODS = new Set(['GET', 'HEAD'])

// Fresh headers only: only allowlisted headers are forwarded to the service binding.
function buildRequestHeaders(request: Request): Headers {
	const headers = new Headers()
	for (const name of FORWARDED_REQUEST_HEADERS) {
		const headerValue = request.headers.get(name)
		if (headerValue) headers.set(name, headerValue)
	}
	return headers
}

function copyResponseHeaders(source: Headers): Headers {
	const headers = new Headers()
	source.forEach((headerValue, key) => {
		if (key.toLowerCase() === 'set-cookie') return
		headers.append(key, headerValue)
	})
	for (const cookie of source.getSetCookie()) {
		headers.append('set-cookie', cookie)
	}
	return headers
}

async function readRequestBody(request: Request): Promise<string | undefined> {
	if (BODILESS_METHODS.has(request.method)) return undefined
	return request.text()
}

export async function proxyAuthRequest(
	env: Pick<Env, 'API'>,
	request: Request,
	authPath: string | undefined,
): Promise<Response> {
	const { search } = new URL(request.url)
	const target = `${AUTH_BASE_PATH}/${authPath ?? ''}${search}`
	const apiResponse = await fetchFromApi(env, target, {
		method: request.method,
		headers: buildRequestHeaders(request),
		body: await readRequestBody(request),
	})
	return new Response(apiResponse.body, {
		status: apiResponse.status,
		statusText: apiResponse.statusText,
		headers: copyResponseHeaders(apiResponse.headers),
	})
}
