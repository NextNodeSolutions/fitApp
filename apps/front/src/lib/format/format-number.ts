const NUMBER_FORMAT = new Intl.NumberFormat('fr-FR', {
	maximumFractionDigits: 1,
})

export function formatNumber(amount: number): string {
	return NUMBER_FORMAT.format(amount)
}
