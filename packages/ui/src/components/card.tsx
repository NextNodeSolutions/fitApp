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

const cardHeaderVariants = cva(
	'flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1',
)

const cardTitleVariants = cva('text-[15px] font-medium tracking-tight')

const cardDescriptionVariants = cva('text-sm text-muted-foreground')

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
			className={cn(cardHeaderVariants(), className)}
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
			className={cn(cardTitleVariants(), className)}
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
			className={cn(cardDescriptionVariants(), className)}
			{...props}
		/>
	)
}

export {
	Card,
	CardDescription,
	cardDescriptionVariants,
	CardHeader,
	cardHeaderVariants,
	CardTitle,
	cardTitleVariants,
	cardVariants,
}
