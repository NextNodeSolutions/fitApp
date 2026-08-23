import { afterEach, describe, expect, it, vi } from 'vitest'

import { readFitAppConfig } from './read-fitapp-config.ts'

afterEach(() => {
	vi.unstubAllEnvs()
})

describe('readFitAppConfig', () => {
	it('fails fast when the API token is missing', () => {
		vi.stubEnv('FITAPP_API_TOKEN', '')

		expect(() => readFitAppConfig()).toThrow(
			'FITAPP_API_TOKEN est manquant',
		)
	})

	it('returns the trimmed API token', () => {
		vi.stubEnv('FITAPP_API_TOKEN', ' token ')

		expect(readFitAppConfig()).toEqual({ apiToken: 'token' })
	})
})
