import { useState } from 'react'

import { submitSignOut } from './submit-sign-out'

const LOGIN_PATH = '/login'

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
		window.location.href = LOGIN_PATH
	}

	return { signOut, pending: state.pending, failed: state.failed }
}
