import { ProfileNotFoundError } from '@fitapp/contracts'

import type { Profile } from '../domain/profile'
import type { ProfileRepository } from '../ports/profile-repository'

export type GetProfileDeps = {
	repository: ProfileRepository
}

export async function getProfile(
	deps: GetProfileDeps,
	sessionId: string,
): Promise<Profile> {
	const profile = await deps.repository.findBySessionId(sessionId)
	if (!profile) throw new ProfileNotFoundError()
	return profile
}
