import { env } from 'cloudflare:workers'

import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request }) => {
	const apiResponse = await env.API.fetch('/api/onboarding', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: await request.text(),
	})

	const body = await apiResponse.text()

	return new Response(body, {
		status: apiResponse.status,
		headers: { 'Content-Type': 'application/json' },
	})
}
