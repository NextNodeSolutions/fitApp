import type { OwnedProfile, Profile } from '../domain/profile'

export interface ProfileRepository {
	save(profile: OwnedProfile): Promise<void>
	findBySessionId(sessionId: string): Promise<Profile | null>
}
