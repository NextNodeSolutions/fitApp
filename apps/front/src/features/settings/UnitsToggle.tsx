import { UNITS_OPTIONS } from '@fitapp/contracts'
import { Card, CardTitle, RadioGroup } from '@fitapp/ui'

import { ProfileRadioOptionRow } from './profile-radio-option-row'
import { useUnits } from './use-units'

import type { Units } from '@fitapp/contracts'
import type { ReactElement } from 'react'

type UnitsToggleProps = {
	units: Units
}

export function UnitsToggle({ units }: UnitsToggleProps): ReactElement {
	const {
		units: selectedUnits,
		pending,
		errorMessage,
		changeUnits,
	} = useUnits(units)

	const handleValueChange = (nextUnits: string): void => {
		const matched = UNITS_OPTIONS.find(option => option.value === nextUnits)
		if (matched) {
			void changeUnits(matched.value)
		}
	}

	return (
		<Card>
			<CardTitle id="units-title">Unités</CardTitle>
			<RadioGroup
				aria-labelledby="units-title"
				value={selectedUnits}
				onValueChange={handleValueChange}
				aria-invalid={!!errorMessage}
				className="mt-5 sm:grid-cols-2"
			>
				{UNITS_OPTIONS.map(option => (
					<ProfileRadioOptionRow key={option.value} option={option} />
				))}
			</RadioGroup>
			{pending ? (
				<p role="status" className="text-muted-foreground mt-3 text-sm">
					Enregistrement…
				</p>
			) : null}
			{errorMessage ? (
				<p role="alert" className="text-destructive mt-3 text-sm">
					{errorMessage}
				</p>
			) : null}
		</Card>
	)
}
