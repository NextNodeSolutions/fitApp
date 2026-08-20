import { SettingsTokenResponseSchema } from '@fitapp/contracts'
import * as v from 'valibot'

export function parseSettingsTokenResponse(payload: unknown): string | null {
	const parsed = v.safeParse(SettingsTokenResponseSchema, payload)
	if (!parsed.success) return null
	return parsed.output.token
}
