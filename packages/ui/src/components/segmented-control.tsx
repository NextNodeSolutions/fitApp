import * as React from 'react'

import { cn } from '../lib/utils'

function SegmentedControl({
	className,
	...props
}: React.ComponentProps<'nav'>): React.ReactElement {
	return (
		<nav
			data-slot="segmented-control"
			className={cn(
				'inline-grid auto-cols-fr grid-flow-col gap-1 rounded-full bg-card p-1',
				className,
			)}
			{...props}
		/>
	)
}

/** One segment, rendered as a link: mark the active one with `aria-current="page"`. */
function SegmentedControlItem({
	className,
	...props
}: React.ComponentProps<'a'>): React.ReactElement {
	return (
		<a
			data-slot="segmented-control-item"
			className={cn(
				'inline-flex h-11 items-center justify-center rounded-full px-4 text-sm font-medium whitespace-nowrap text-muted-foreground transition-[background-color,color,box-shadow] duration-200 ease-out hover:text-foreground md:h-9',
				'aria-[current=page]:bg-background aria-[current=page]:text-foreground aria-[current=page]:shadow-sm',
				className,
			)}
			{...props}
		/>
	)
}

export { SegmentedControl, SegmentedControlItem }
