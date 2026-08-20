import { AUTH_BASE_PATH } from '@fitapp/contracts'

export type SignOutResult = { ok: true } | { ok: false }

export async function submitSignOut(): Promise<SignOutResult> {
	try {
		const response = await fetch(`${AUTH_BASE_PATH}/sign-out`, {
			method: 'POST',
		})
		return response.ok ? { ok: true } : { ok: false }
	} catch {
		return { ok: false }
	}
}
