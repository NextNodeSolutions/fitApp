import { describe, expect, it } from 'vitest'

import { resolveAuthRedirect } from './resolve-auth-redirect'

describe('resolveAuthRedirect', () => {
	it('redirects guests away from protected pages', () => {
		expect(resolveAuthRedirect('/dashboard', false)).toBe('/login')
		expect(resolveAuthRedirect('/onboarding', false)).toBe('/login')
		expect(resolveAuthRedirect('/parametres', false)).toBe('/login')
	})

	it('lets authenticated users onto protected pages', () => {
		expect(resolveAuthRedirect('/dashboard', true)).toBe(null)
	})

	it('redirects authenticated users away from guest pages', () => {
		expect(resolveAuthRedirect('/login', true)).toBe('/dashboard')
		expect(resolveAuthRedirect('/signup', true)).toBe('/dashboard')
	})

	it('lets guests onto guest pages', () => {
		expect(resolveAuthRedirect('/login', false)).toBe(null)
		expect(resolveAuthRedirect('/signup', false)).toBe(null)
	})

	it('ignores unrelated pages', () => {
		expect(resolveAuthRedirect('/', false)).toBe(null)
		expect(resolveAuthRedirect('/', true)).toBe(null)
	})
})
