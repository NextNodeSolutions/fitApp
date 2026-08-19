import { Label, RadioGroupItem } from '@fitapp/ui'

import type { RadioOption } from '@fitapp/contracts'
import type { ReactElement } from 'react'

export function RadioOptionRow({
	option,
}: {
	option: RadioOption
}): ReactElement {
	return (
		<Label className="border-input has-[[data-checked]]:border-primary has-[[data-checked]]:bg-primary/10 cursor-pointer items-start gap-3 rounded-md border p-3">
			<RadioGroupItem value={option.value} className="mt-0.5" />
			<span className="flex flex-col">
				<span>{option.label}</span>
				{option.hint ? (
					<span className="text-muted-foreground text-xs font-normal">
						{option.hint}
					</span>
				) : null}
			</span>
		</Label>
	)
}
