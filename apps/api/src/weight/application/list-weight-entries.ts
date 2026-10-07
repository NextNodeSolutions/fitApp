import type { WeightEntry } from '../domain/weight-entry'
import type { WeightRepository } from '../ports/weight-repository'

export function listWeightEntries(
	repository: WeightRepository,
	userId: string,
	sinceDate: string,
): Promise<WeightEntry[]> {
	return repository.listSince(userId, sinceDate)
}
