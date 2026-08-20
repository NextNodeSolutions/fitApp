import { useEffect, useRef, useState } from 'react'

import { scheduleCopiedReset } from './copied-reset-timer'

export function useApiTokenCopy(): {
	copied: boolean
	copyToken: (token: string) => Promise<void>
} {
	const [copied, setCopied] = useState(false)
	const cancelReset = useRef<(() => void) | null>(null)

	useEffect(
		() => () => {
			cancelReset.current?.()
		},
		[],
	)

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

	return { copied, copyToken }
}
