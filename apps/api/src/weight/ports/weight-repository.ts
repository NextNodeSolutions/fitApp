import type { OwnedWeightEntry, WeightEntry } from '../domain/weight-entry'

export interface WeightRepository {
	upsertByDate(entry: OwnedWeightEntry): Promise<void>
	listSince(userId: string, sinceDate: string): Promise<WeightEntry[]>
	findLatest(userId: string): Promise<WeightEntry | null>
}
