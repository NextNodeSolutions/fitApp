import type { OwnedWeightEntry } from '../domain/weight-entry'
import type { WeightRepository } from '../ports/weight-repository'

export function saveWeightEntry(
	repository: WeightRepository,
	entry: OwnedWeightEntry,
): Promise<void> {
	return repository.upsertByDate(entry)
}
