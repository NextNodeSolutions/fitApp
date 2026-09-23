import {
	HTTP_UNAUTHORIZED,
	INGEST_INVALID_TOKEN_MESSAGE,
} from '@fitapp/contracts'
import { createMcpHandler } from '@modelcontextprotocol/server'

import { readBearerToken } from './bearer-token.ts'
import { createServer } from './create-server.ts'

import type { ApiFetch } from './read-fitapp-config.ts'

// Dummy origin: the Fetcher binding ignores the host; the Fetch API still
// requires an absolute URL.
const SERVICE_BINDING_ORIGIN = 'https://api.internal'

function createBindingFetch(binding: Fetcher): ApiFetch {
	return (path, init) =>
		binding.fetch(new URL(path, SERVICE_BINDING_ORIGIN), init)
}

function unauthorizedResponse(): Response {
	return Response.json(
		{ error: INGEST_INVALID_TOKEN_MESSAGE },
		{ status: HTTP_UNAUTHORIZED },
	)
}

// Stateless remote MCP: the Bearer header carries the caller's FitApp API
// token; every request builds a fresh server instance wired to it.
// oxlint-disable-next-line import/no-default-export
export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		if (
			request.method === 'GET' &&
			new URL(request.url).pathname === '/healthz'
		) {
			return Response.json({ status: 'ok', service: 'mcp' })
		}
		const apiToken = readBearerToken(request.headers.get('Authorization'))
		if (!apiToken) return unauthorizedResponse()
		const handler = createMcpHandler(() =>
			createServer({
				apiToken,
				apiFetch: createBindingFetch(env.API),
			}),
		)
		return handler.fetch(request)
	},
} satisfies ExportedHandler<Env>
