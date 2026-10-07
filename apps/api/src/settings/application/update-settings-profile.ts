import type { SettingsProfile, SettingsProfilePatch } from '@fitapp/contracts'
import type { SettingsProfileRepository } from '../ports/settings-profile-repository'

export function updateSettingsProfile(
	repository: SettingsProfileRepository,
	userId: string,
	patch: SettingsProfilePatch,
): Promise<SettingsProfile | null> {
	return repository.updateByUserId(userId, patch)
}
