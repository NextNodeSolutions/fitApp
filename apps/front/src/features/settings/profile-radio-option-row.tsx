import { Label, RadioGroupItem } from '@fitapp/ui'

import type { RadioOption } from '@fitapp/contracts'
import type { ReactElement } from 'react'

export function ProfileRadioOptionRow({
	option,
}: {
	option: RadioOption
}): ReactElement {
	return (
		<Label className="bg-background hover:border-foreground/30 has-[[data-checked]]:border-foreground min-h-14 cursor-pointer gap-3 rounded-2xl border border-transparent px-4 py-3 text-[15px] leading-snug transition-colors">
			<RadioGroupItem value={option.value} />
			<span className="flex flex-col gap-0.5">
				<span>{option.label}</span>
				{option.hint ? (
					<span className="text-muted-foreground text-[13px] font-normal">
						{option.hint}
					</span>
				) : null}
			</span>
		</Label>
	)
}
