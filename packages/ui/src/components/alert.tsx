import * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../lib/utils'

const alertVariants = cva('rounded-lg px-4 py-3 text-sm', {
	variants: {
		tone: {
			destructive: 'bg-destructive/10 text-destructive',
			positive: 'bg-brand-soft text-brand-ink',
		},
	},
	defaultVariants: {
		tone: 'destructive',
	},
})

function Alert({
	className,
	tone = 'destructive',
	...props
}: React.ComponentProps<'div'> &
	VariantProps<typeof alertVariants>): React.ReactElement {
	return (
		<div
			data-slot="alert"
			className={cn(alertVariants({ tone }), className)}
			{...props}
		/>
	)
}

export { Alert, alertVariants }
