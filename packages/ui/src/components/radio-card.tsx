import * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../lib/utils'

import { Label } from './label'
import { RadioGroupItem } from './radio-group'

const radioCardVariants = cva(
	'min-h-14 cursor-pointer gap-3 rounded-2xl border bg-background px-4 py-3 text-[15px] leading-snug transition-colors hover:border-foreground/30 has-[[data-checked]]:border-foreground',
	{
		variants: {
			// The surface the option sits on: a bordered row on the page, a borderless one inside a Card.
			surface: {
				page: 'border-border has-[[data-checked]]:bg-card',
				card: 'border-transparent',
			},
		},
		defaultVariants: {
			surface: 'page',
		},
	},
)

/** One option of a `RadioGroup`, rendered as a clickable card with an optional hint line. */
function RadioCard({
	value,
	hint,
	surface = 'page',
	className,
	children,
}: {
	value: string
	hint?: React.ReactNode
	className?: string
	children: React.ReactNode
} & VariantProps<typeof radioCardVariants>): React.ReactElement {
	return (
		<Label className={cn(radioCardVariants({ surface }), className)}>
			<RadioGroupItem value={value} />
			<span className="flex flex-col gap-0.5">
				<span>{children}</span>
				{hint ? (
					<span className="text-muted-foreground text-[13px] font-normal">
						{hint}
					</span>
				) : null}
			</span>
		</Label>
	)
}

export { RadioCard, radioCardVariants }
