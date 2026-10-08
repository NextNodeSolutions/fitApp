import * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../lib/utils'

const PERCENT = 100

const trackVariants = cva(
	'relative w-full overflow-hidden rounded-full bg-secondary',
	{
		variants: {
			size: {
				sm: 'h-1.5',
				md: 'h-2',
				lg: 'h-3',
			},
		},
		defaultVariants: {
			size: 'md',
		},
	},
)

const indicatorVariants = cva(
	'absolute inset-y-0 left-0 origin-left rounded-full motion-safe:animate-[progress-grow_1.1s_cubic-bezier(0.22,1,0.36,1)_both]',
	{
		variants: {
			tone: {
				brand: 'bg-brand',
				ink: 'bg-foreground',
				lime: 'bg-lime',
				warning: 'bg-warning',
			},
		},
		defaultVariants: {
			tone: 'brand',
		},
	},
)

type ProgressProps = Omit<React.ComponentProps<'div'>, 'children'> &
	VariantProps<typeof trackVariants> &
	VariantProps<typeof indicatorVariants> & {
		/** Share of the goal reached, from 0 to 1 (clamped). */
		value: number
		label: string
	}

function Progress({
	className,
	value,
	label,
	size,
	tone,
	...props
}: ProgressProps): React.ReactElement {
	const clamped = Math.min(1, Math.max(0, value))
	return (
		<div
			data-slot="progress"
			role="progressbar"
			aria-label={label}
			aria-valuemin={0}
			aria-valuemax={PERCENT}
			aria-valuenow={Math.round(clamped * PERCENT)}
			className={cn(trackVariants({ size }), className)}
			{...props}
		>
			<span
				className={indicatorVariants({ tone })}
				style={{ width: `${clamped * PERCENT}%` }}
			/>
		</div>
	)
}

export { Progress }
