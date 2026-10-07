import { captureException } from '@sentry/astro'

import { callApiRpc } from '../../lib/call-api-rpc'

import { parseSettingsProfileResponse } from './parse-settings-profile-response'

import type { SettingsProfile } from '@fitapp/contracts'

export async function fetchSettingsProfile(
	env: Pick<Env, 'API'>,
	userId: string | null,
): Promise<SettingsProfile | null> {
	if (!userId) return null
	try {
		const payload = await callApiRpc(env, 'getSettingsProfile', userId)
		return parseSettingsProfileResponse(payload)
	} catch (error) {
		captureException(error)
		return null
	}
}
