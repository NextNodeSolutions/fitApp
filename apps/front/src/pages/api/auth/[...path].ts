import { env } from 'cloudflare:workers'

import { proxyAuthRequest } from '../../../lib/auth/proxy-auth-request'

import type { APIRoute } from 'astro'

export const ALL: APIRoute = ({ request, params }) =>
	proxyAuthRequest(env, request, params.path)
