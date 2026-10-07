import type { AccountRepository } from '../ports/account-repository'

export function deleteAccount(
	repository: AccountRepository,
	userId: string,
): Promise<void> {
	return repository.deleteByUserId(userId)
}
