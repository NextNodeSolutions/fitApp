export type WeightEntry = {
	entryDate: string
	weightKg: number
}

export type OwnedWeightEntry = WeightEntry & {
	userId: string
}
