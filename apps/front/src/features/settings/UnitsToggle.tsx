import { UNITS_OPTIONS } from '@fitapp/contracts'
import { Label, RadioGroup, RadioGroupItem } from '@fitapp/ui'

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
		<div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
			<h2 className="text-lg font-semibold">Unités d'affichage</h2>
			<RadioGroup
				value={selectedUnits}
				onValueChange={handleValueChange}
				aria-invalid={!!errorMessage}
				className="mt-4"
			>
				{UNITS_OPTIONS.map(option => (
					<Label
						key={option.value}
						className="border-input has-[[data-checked]]:border-primary has-[[data-checked]]:bg-primary/10 cursor-pointer items-start gap-3 rounded-md border p-3"
					>
						<RadioGroupItem
							value={option.value}
							className="mt-0.5"
						/>
						<span>{option.label}</span>
					</Label>
				))}
			</RadioGroup>
			{pending ? (
				<p className="mt-3 text-sm text-gray-400">Enregistrement…</p>
			) : null}
			{errorMessage ? (
				<p role="alert" className="text-destructive mt-3 text-sm">
					{errorMessage}
				</p>
			) : null}
		</div>
	)
}
