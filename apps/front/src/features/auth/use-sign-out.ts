import { useState } from 'react'

import { ROUTES } from '../../lib/routes'

import { submitSignOut } from './submit-sign-out'

export function useSignOut(): {
	signOut: () => Promise<void>
	pending: boolean
	failed: boolean
} {
	const [state, setState] = useState({ pending: false, failed: false })

	const signOut = async (): Promise<void> => {
		setState({ pending: true, failed: false })
		const outcome = await submitSignOut()
		if (!outcome.ok) {
			setState({ pending: false, failed: true })
			return
		}
		window.location.href = ROUTES.login
	}

	return { signOut, pending: state.pending, failed: state.failed }
}
