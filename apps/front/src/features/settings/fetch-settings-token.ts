import { fetchFromApi } from '../../lib/api'

import { parseSettingsTokenResponse } from './parse-settings-token-response'

const SETTINGS_TOKEN_PATH = '/api/settings/token'

export async function fetchSettingsToken(
	env: Pick<Env, 'API'>,
	cookie: string | null,
): Promise<string | null> {
	if (!cookie) return null
	try {
		const response = await fetchFromApi(env, SETTINGS_TOKEN_PATH, {
			headers: { cookie },
		})
		if (!response.ok) return null
		const payload: unknown = await response.json()
		return parseSettingsTokenResponse(payload)
	} catch {
		return null
	}
}
