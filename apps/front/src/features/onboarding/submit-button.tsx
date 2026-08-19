import { Button } from '@fitapp/ui'
import { LoaderCircle } from 'lucide-react'

import type { ReactElement } from 'react'

export function SubmitButton({
	submitting,
}: {
	submitting: boolean
}): ReactElement {
	return (
		<Button type="submit" disabled={submitting} className="w-full">
			{submitting ? (
				<>
					<LoaderCircle className="animate-spin" />
					Enregistrement…
				</>
			) : (
				'Commencer mon suivi'
			)}
		</Button>
	)
}
