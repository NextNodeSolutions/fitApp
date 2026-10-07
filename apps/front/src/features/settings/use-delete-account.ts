import { useState } from 'react'

import { submitDeleteAccount } from './submit-delete-account'

const HOME_PATH = '/'

export type UseDeleteAccount = {
	isConfirmingDelete: boolean
	pending: boolean
	failed: boolean
	requestConfirm: () => void
	cancelDelete: () => void
	deleteAccount: () => Promise<void>
}

export function useDeleteAccount(): UseDeleteAccount {
	const [state, setState] = useState<{
		isConfirmingDelete: boolean
		pending: boolean
		failed: boolean
	}>({ isConfirmingDelete: false, pending: false, failed: false })

	const requestConfirm = (): void => {
		setState({ isConfirmingDelete: true, pending: false, failed: false })
	}

	const cancelDelete = (): void => {
		setState({ isConfirmingDelete: false, pending: false, failed: false })
	}

	const deleteAccount = async (): Promise<void> => {
		setState(previousState => ({
			...previousState,
			pending: true,
			failed: false,
		}))
		const outcome = await submitDeleteAccount()
		if (!outcome.ok) {
			setState(previousState => ({
				...previousState,
				pending: false,
				failed: true,
			}))
			return
		}
		window.location.href = HOME_PATH
	}

	return { ...state, requestConfirm, cancelDelete, deleteAccount }
}
