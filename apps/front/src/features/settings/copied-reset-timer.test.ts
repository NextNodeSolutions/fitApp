import { afterEach, describe, expect, it, vi } from 'vitest'

import { scheduleCopiedReset } from './copied-reset-timer'

const COPIED_RESET_DELAY_MS = 2000

afterEach(() => {
	vi.useRealTimers()
})

describe('scheduleCopiedReset', () => {
	it('resets the copied state after two seconds', () => {
		vi.useFakeTimers()
		const reset = vi.fn()

		scheduleCopiedReset(reset)
		vi.advanceTimersByTime(COPIED_RESET_DELAY_MS)

		expect(reset).toHaveBeenCalledOnce()
	})

	it('can cancel the pending reset', () => {
		vi.useFakeTimers()
		const reset = vi.fn()

		const cancel = scheduleCopiedReset(reset)
		cancel()
		vi.runAllTimers()

		expect(reset).not.toHaveBeenCalled()
	})
})
