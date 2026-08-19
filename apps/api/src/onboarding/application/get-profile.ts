import type { Profile } from '../domain/profile'
import type { ProfileRepository } from '../ports/profile-repository'

export type GetProfileDeps = {
	repository: ProfileRepository
}

export async function getProfile(
	deps: GetProfileDeps,
	sessionId: string,
): Promise<Profile | null> {
	return deps.repository.findBySessionId(sessionId)
}
