const STEP_NUMBER_DIGITS = 2

/** Step index 0 reads "01". */
export function formatStepNumber(index: number): string {
	return String(index + 1).padStart(STEP_NUMBER_DIGITS, '0')
}
