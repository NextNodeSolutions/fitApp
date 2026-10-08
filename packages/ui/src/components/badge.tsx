import * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../lib/utils'

const badgeVariants = cva(
	'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] leading-none font-medium whitespace-nowrap',
	{
		variants: {
			tone: {
				neutral: 'bg-background text-muted-foreground',
				positive:
					'bg-brand-soft text-brand-ink before:size-1.5 before:rounded-full before:bg-current',
				warning:
					'bg-warning-soft text-warning before:size-1.5 before:rounded-full before:bg-current',
			},
		},
		defaultVariants: {
			tone: 'neutral',
		},
	},
)

function Badge({
	className,
	tone = 'neutral',
	...props
}: React.ComponentProps<'span'> &
	VariantProps<typeof badgeVariants>): React.ReactElement {
	return (
		<span
			data-slot="badge"
			className={cn(badgeVariants({ tone }), className)}
			{...props}
		/>
	)
}

export { Badge, badgeVariants }
