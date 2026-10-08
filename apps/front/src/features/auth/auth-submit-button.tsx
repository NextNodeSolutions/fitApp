import { Button } from '@fitapp/ui'
import { LoaderCircle } from 'lucide-react'

import type { ReactElement } from 'react'

export function AuthSubmitButton({
	submitting,
	label,
	loadingLabel,
}: {
	submitting: boolean
	label: string
	loadingLabel: string
}): ReactElement {
	return (
		<Button
			type="submit"
			size="lg"
			disabled={submitting}
			className="mt-2 w-full"
		>
			{submitting ? (
				<>
					<LoaderCircle className="animate-spin" />
					{loadingLabel}
				</>
			) : (
				label
			)}
		</Button>
	)
}
