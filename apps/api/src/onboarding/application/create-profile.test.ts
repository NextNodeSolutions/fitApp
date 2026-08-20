import { describe, expect, it, vi } from 'vitest'

import { createProfile } from './create-profile'

import type { ProfileRepository } from '../ports/profile-repository'

const SUBMISSION = {
	height: 180,
	weight: 80,
	age: 30,
	sex: 'male' as const,
	activityLevel: 'moderate' as const,
}

describe('createProfile', () => {
	it('associates the authenticated user and generated API token', async () => {
		const repository: ProfileRepository = {
			save: vi.fn(async () => undefined),
			findBySessionId: vi.fn(async () => null),
		}

		const profile = await createProfile(
			{
				repository,
				generateSessionId: () => 'session-1',
				generateApiToken: () => 'a'.repeat(32),
				userId: 'user-1',
			},
			SUBMISSION,
		)

		expect(profile).toEqual({
			...SUBMISSION,
			sessionId: 'session-1',
			apiToken: 'a'.repeat(32),
			userId: 'user-1',
		})
		expect(repository.save).toHaveBeenCalledWith(profile)
	})
})
