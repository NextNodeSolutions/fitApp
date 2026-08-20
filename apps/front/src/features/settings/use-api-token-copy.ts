import { useCallback, useRef, useState } from 'react'

import { scheduleCopiedReset } from './copied-reset-timer'

export function useApiTokenCopy(): {
	copied: boolean
	copyButtonRef: (
		button: HTMLButtonElement | null,
	) => (() => void) | undefined
	copyToken: (token: string) => Promise<void>
} {
	const [copied, setCopied] = useState(false)
	const cancelReset = useRef<(() => void) | null>(null)
	const copyButtonRef = useCallback((button: HTMLButtonElement | null) => {
		if (!button) return
		return () => cancelReset.current?.()
	}, [])

	const copyToken = async (token: string): Promise<void> => {
		try {
			await navigator.clipboard.writeText(token)
		} catch {
			setCopied(false)
			return
		}
		setCopied(true)
		cancelReset.current?.()
		cancelReset.current = scheduleCopiedReset(() => {
			setCopied(false)
			cancelReset.current = null
		})
	}

	return { copied, copyButtonRef, copyToken }
}
