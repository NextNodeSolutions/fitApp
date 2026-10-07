import * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../lib/utils'

const cardVariants = cva('rounded-3xl p-5 sm:p-6', {
	variants: {
		tone: {
			muted: 'bg-card text-card-foreground',
			inverse: 'bg-foreground text-background',
			outline: 'border border-border bg-background',
		},
	},
	defaultVariants: {
		tone: 'muted',
	},
})

function Card({
	className,
	tone = 'muted',
	...props
}: React.ComponentProps<'section'> &
	VariantProps<typeof cardVariants>): React.ReactElement {
	return (
		<section
			data-slot="card"
			className={cn(cardVariants({ tone }), className)}
			{...props}
		/>
	)
}

function CardHeader({
	className,
	...props
}: React.ComponentProps<'header'>): React.ReactElement {
	return (
		<header
			data-slot="card-header"
			className={cn(
				'flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1',
				className,
			)}
			{...props}
		/>
	)
}

function CardTitle({
	className,
	...props
}: React.ComponentProps<'h2'>): React.ReactElement {
	return (
		<h2
			data-slot="card-title"
			className={cn('text-[15px] font-medium tracking-tight', className)}
			{...props}
		/>
	)
}

function CardDescription({
	className,
	...props
}: React.ComponentProps<'p'>): React.ReactElement {
	return (
		<p
			data-slot="card-description"
			className={cn('text-sm text-muted-foreground', className)}
			{...props}
		/>
	)
}

export { Card, CardDescription, CardHeader, CardTitle, cardVariants }
