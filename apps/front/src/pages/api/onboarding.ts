import { env } from 'cloudflare:workers'

import { fetchFromApi } from '../../lib/api'

import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request }) => {
	const apiResponse = await fetchFromApi(env, '/api/onboarding', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			cookie: request.headers.get('cookie') ?? '',
		},
		body: await request.text(),
	})

	const body = await apiResponse.text()

	return new Response(body, {
		status: apiResponse.status,
		headers: { 'Content-Type': 'application/json' },
	})
}
