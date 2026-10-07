const WEIGHT_DELTA_FORMAT = new Intl.NumberFormat('fr-FR', {
	maximumFractionDigits: 1,
	signDisplay: 'exceptZero',
})

export function formatWeightDelta(delta: number, unitLabel: string): string {
	return `${WEIGHT_DELTA_FORMAT.format(delta)} ${unitLabel}`
}
