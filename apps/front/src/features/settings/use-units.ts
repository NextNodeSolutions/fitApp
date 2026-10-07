import { useState } from 'react'

import { submitProfilePatch } from './submit-profile-patch'

import type { Units } from '@fitapp/contracts'

export type UseUnits = {
	units: Units
	pending: boolean
	errorMessage: string | null
	changeUnits: (units: Units) => Promise<void>
}

export function useUnits(initialUnits: Units): UseUnits {
	const [state, setState] = useState<{
		units: Units
		pending: boolean
		errorMessage: string | null
	}>({ units: initialUnits, pending: false, errorMessage: null })

	const changeUnits = async (nextUnits: Units): Promise<void> => {
		const previousUnits = state.units
		setState({ units: nextUnits, pending: true, errorMessage: null })
		const submission = await submitProfilePatch({ units: nextUnits })
		if (!submission.ok) {
			setState({
				units: previousUnits,
				pending: false,
				errorMessage: submission.error.message,
			})
			return
		}
		setState({ units: nextUnits, pending: false, errorMessage: null })
	}

	return { ...state, changeUnits }
}
