import { afterEach, describe, expect, it, vi } from 'vitest'

import { readFitAppConfig } from './read-fitapp-config.ts'

afterEach(() => {
	vi.unstubAllEnvs()
})

describe('readFitAppConfig', () => {
	it('fails fast when required variables are missing', () => {
		vi.stubEnv('FITAPP_URL', '')
		vi.stubEnv('FITAPP_API_TOKEN', '')

		expect(() => readFitAppConfig()).toThrow('FITAPP_URL est manquant')
	})

	it('rejects a malformed or unsupported URL', () => {
		vi.stubEnv('FITAPP_API_TOKEN', 'token')
		vi.stubEnv('FITAPP_URL', 'not-a-url')
		expect(() => readFitAppConfig()).toThrow('FITAPP_URL est invalide')

		vi.stubEnv('FITAPP_URL', 'ftp://example.com')
		expect(() => readFitAppConfig()).toThrow('FITAPP_URL est invalide')
	})

	it('normalizes the URL and returns the token', () => {
		vi.stubEnv('FITAPP_API_TOKEN', ' token ')
		vi.stubEnv('FITAPP_URL', 'https://api.example.com/path?ignored=true')

		expect(readFitAppConfig()).toEqual({
			fitappUrl: 'https://api.example.com',
			apiToken: 'token',
		})
	})
})
