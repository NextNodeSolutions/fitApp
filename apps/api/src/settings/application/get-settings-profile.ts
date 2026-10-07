import type { SettingsProfile } from '@fitapp/contracts'
import type { SettingsProfileRepository } from '../ports/settings-profile-repository'

export function getSettingsProfile(
	repository: SettingsProfileRepository,
	userId: string,
): Promise<SettingsProfile | null> {
	return repository.findByUserId(userId)
}
