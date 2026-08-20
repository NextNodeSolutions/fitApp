import type { ApiTokenRepository } from '../ports/api-token-repository'

export function getApiToken(
	repository: ApiTokenRepository,
	userId: string,
): Promise<string | null> {
	return repository.findByUserId(userId)
}
