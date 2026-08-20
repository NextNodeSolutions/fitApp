const COPIED_RESET_DELAY_MS = 2000

export function scheduleCopiedReset(reset: () => void): () => void {
	const timer = setTimeout(reset, COPIED_RESET_DELAY_MS)
	return () => clearTimeout(timer)
}
