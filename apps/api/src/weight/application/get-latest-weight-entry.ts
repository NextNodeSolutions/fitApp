import type { WeightEntry } from '../domain/weight-entry'
import type { WeightRepository } from '../ports/weight-repository'

export function getLatestWeightEntry(
	repository: WeightRepository,
	userId: string,
): Promise<WeightEntry | null> {
	return repository.findLatest(userId)
}
