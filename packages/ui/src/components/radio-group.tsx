'use client'

import * as React from 'react'

import { Radio as RadioPrimitive } from '@base-ui/react/radio'
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group'

import { cn } from '../lib/utils'

function RadioGroup({
	className,
	...props
}: RadioGroupPrimitive.Props<string>): React.ReactElement {
	return (
		<RadioGroupPrimitive
			data-slot="radio-group"
			className={cn('grid w-full gap-2', className)}
			{...props}
		/>
	)
}

function RadioGroupItem({
	className,
	...props
}: RadioPrimitive.Root.Props<string>): React.ReactElement {
	return (
		<RadioPrimitive.Root
			data-slot="radio-group-item"
			className={cn(
				'group/radio-group-item peer relative flex aspect-square size-4 shrink-0 rounded-full border border-input outline-none',
				'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20',
				'disabled:cursor-not-allowed disabled:opacity-50',
				'aria-invalid:border-destructive',
				'data-checked:border-primary data-checked:bg-primary',
				className,
			)}
			{...props}
		>
			<RadioPrimitive.Indicator
				data-slot="radio-group-indicator"
				className="flex size-4 items-center justify-center"
			>
				<span className="bg-primary-foreground size-2 rounded-full" />
			</RadioPrimitive.Indicator>
		</RadioPrimitive.Root>
	)
}

export { RadioGroup, RadioGroupItem }
