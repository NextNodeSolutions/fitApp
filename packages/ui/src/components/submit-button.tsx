import * as React from 'react'

import { LoaderCircle } from 'lucide-react'

import { Button } from './button'

/** Submit button that disables itself and shows a spinner with `pendingLabel` while `pending`. */
function SubmitButton({
	pending,
	pendingLabel,
	children,
	...props
}: Omit<React.ComponentProps<typeof Button>, 'type' | 'disabled'> & {
	pending: boolean
	pendingLabel: React.ReactNode
}): React.ReactElement {
	return (
		<Button type="submit" disabled={pending} {...props}>
			{pending ? (
				<>
					<LoaderCircle className="animate-spin" />
					{pendingLabel}
				</>
			) : (
				children
			)}
		</Button>
	)
}

export { SubmitButton }
