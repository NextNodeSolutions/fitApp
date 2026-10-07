import type { SettingsProfile, SettingsProfilePatch } from '@fitapp/contracts'

export interface SettingsProfileRepository {
	findByUserId(userId: string): Promise<SettingsProfile | null>
	updateByUserId(
		userId: string,
		patch: SettingsProfilePatch,
	): Promise<SettingsProfile | null>
}
