import type { OnboardingBody } from '@fitapp/contracts'
import type { OwnedProfile } from '../domain/profile'
import type { ProfileRepository } from '../ports/profile-repository'

export type CreateProfileDeps = {
	repository: ProfileRepository
	generateSessionId: () => string
	generateApiToken: () => string
	userId: string
}

export async function createProfile(
	deps: CreateProfileDeps,
	submission: OnboardingBody,
): Promise<OwnedProfile> {
	const profile: OwnedProfile = {
		sessionId: deps.generateSessionId(),
		apiToken: deps.generateApiToken(),
		userId: deps.userId,
		...submission,
	}
	await deps.repository.save(profile)
	return profile
}
