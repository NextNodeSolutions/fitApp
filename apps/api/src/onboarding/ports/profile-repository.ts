import type { Profile } from '../domain/profile'

export interface ProfileRepository {
	save(profile: Profile): Promise<void>
	findBySessionId(sessionId: string): Promise<Profile | null>
}
