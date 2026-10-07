import { SettingsProfileResponseSchema } from '@fitapp/contracts'
import * as v from 'valibot'

import type { SettingsProfile } from '@fitapp/contracts'

export function parseSettingsProfileResponse(
	payload: unknown,
): SettingsProfile | null {
	const parsed = v.safeParse(SettingsProfileResponseSchema, payload)
	if (!parsed.success) return null
	return parsed.output.profile
}
