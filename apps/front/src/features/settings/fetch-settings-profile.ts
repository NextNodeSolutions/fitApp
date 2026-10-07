import { fetchFromApi } from '../../lib/api'

import { parseSettingsProfileResponse } from './parse-settings-profile-response'

import type { SettingsProfile } from '@fitapp/contracts'

const SETTINGS_PROFILE_PATH = '/api/settings/profile'

export async function fetchSettingsProfile(
	env: Pick<Env, 'API'>,
	cookie: string | null,
): Promise<SettingsProfile | null> {
	if (!cookie) return null
	try {
		const response = await fetchFromApi(env, SETTINGS_PROFILE_PATH, {
			headers: { cookie },
		})
		if (!response.ok) return null
		const payload: unknown = await response.json()
		return parseSettingsProfileResponse(payload)
	} catch {
		return null
	}
}
