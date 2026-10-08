import * as React from 'react'

import { cn } from '../lib/utils'

function Input({
	className,
	type,
	...props
}: React.ComponentProps<'input'>): React.ReactElement {
	return (
		<input
			type={type}
			data-slot="input"
			className={cn(
				'flex h-12 w-full rounded-lg border border-input bg-background px-4 text-base text-foreground transition-[border-color,box-shadow] outline-none placeholder:text-muted-foreground',
				'hover:border-foreground/30',
				'focus-visible:border-foreground focus-visible:ring-4 focus-visible:ring-brand-soft focus-visible:outline-none',
				'disabled:cursor-not-allowed disabled:opacity-50',
				'aria-invalid:border-destructive aria-invalid:ring-destructive/15',
				'file:border-0 file:bg-transparent file:text-sm file:font-medium',
				'[&::-webkit-inner-spin-button]:appearance-none',
				className,
			)}
			{...props}
		/>
	)
}

export { Input }
