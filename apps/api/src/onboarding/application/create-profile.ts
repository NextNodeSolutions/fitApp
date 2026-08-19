import type { OnboardingBody } from '@fitapp/contracts'
import type { Profile } from '../domain/profile'
import type { ProfileRepository } from '../ports/profile-repository'

export type CreateProfileDeps = {
	repository: ProfileRepository
	generateSessionId: () => string
}

export async function createProfile(
	deps: CreateProfileDeps,
	submission: OnboardingBody,
): Promise<Profile> {
	const profile: Profile = {
		sessionId: deps.generateSessionId(),
		...submission,
	}
	await deps.repository.save(profile)
	return profile
}
