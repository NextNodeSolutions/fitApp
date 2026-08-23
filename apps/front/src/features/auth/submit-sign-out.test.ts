import { AUTH_BASE_PATH } from '@fitapp/contracts'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { submitSignOut } from './submit-sign-out'

function stubFetch(impl: () => Promise<Response>): void {
	vi.stubGlobal('fetch', vi.fn(impl))
}

afterEach(() => {
	vi.unstubAllGlobals()
})

describe('submitSignOut', () => {
	it('posts an empty JSON body to the sign-out endpoint', async () => {
		stubFetch(async () => new Response(null, { status: 200 }))

		const outcome = await submitSignOut()

		expect(outcome).toEqual({ ok: true })
		expect(vi.mocked(fetch)).toHaveBeenCalledWith(
			`${AUTH_BASE_PATH}/sign-out`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({}),
			},
		)
	})

	it('reports a server rejection', async () => {
		stubFetch(async () => new Response(null, { status: 401 }))

		const outcome = await submitSignOut()

		expect(outcome).toEqual({ ok: false })
	})

	it('reports a network failure', async () => {
		stubFetch(async () => {
			throw new Error('network down')
		})

		const outcome = await submitSignOut()

		expect(outcome).toEqual({ ok: false })
	})
})
