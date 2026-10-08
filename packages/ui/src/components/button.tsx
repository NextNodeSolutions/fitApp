import * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../lib/utils'

const buttonVariants = cva(
	'inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-[background-color,border-color,color,filter,scale] duration-200 ease-out select-none active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4',
	{
		variants: {
			variant: {
				default:
					'bg-primary text-primary-foreground hover:brightness-105',
				dark: 'bg-foreground text-background hover:bg-foreground/85',
				destructive:
					'bg-destructive text-white hover:bg-destructive/90',
				outline:
					'border border-border bg-background hover:border-foreground/30',
				secondary:
					'bg-secondary text-secondary-foreground hover:bg-secondary/70',
				ghost: 'hover:bg-secondary',
				link: 'underline-offset-4 hover:underline active:scale-100',
			},
			size: {
				default: 'h-11 px-5 text-[15px]',
				sm: 'h-9 px-4 text-sm',
				lg: 'h-13 px-6 text-base',
				icon: 'size-11',
			},
		},
		// Size classes come after variant classes: a link drops the button box here.
		compoundVariants: [{ variant: 'link', class: 'h-auto px-0' }],
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
)

function Button({
	className,
	variant = 'default',
	size = 'default',
	...props
}: React.ComponentProps<'button'> &
	VariantProps<typeof buttonVariants>): React.ReactElement {
	return (
		<button
			data-slot="button"
			className={cn(buttonVariants({ variant, size }), className)}
			{...props}
		/>
	)
}

export { Button, buttonVariants }
