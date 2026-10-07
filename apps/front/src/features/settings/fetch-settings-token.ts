import { captureException } from '@sentry/astro'

import { callApiRpc } from '../../lib/call-api-rpc'

import { parseSettingsTokenResponse } from './parse-settings-token-response'

export async function fetchSettingsToken(
	env: Pick<Env, 'API'>,
	userId: string | null,
): Promise<string | null> {
	if (!userId) return null
	try {
		const payload = await callApiRpc(env, 'getApiToken', userId)
		return parseSettingsTokenResponse(payload)
	} catch (error) {
		captureException(error)
		return null
	}
}
