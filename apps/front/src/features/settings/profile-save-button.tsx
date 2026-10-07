import { Button } from '@fitapp/ui'
import { LoaderCircle } from 'lucide-react'

import type { ReactElement } from 'react'

export function ProfileSaveButton({
	submitting,
}: {
	submitting: boolean
}): ReactElement {
	return (
		<Button type="submit" disabled={submitting}>
			{submitting ? (
				<>
					<LoaderCircle className="animate-spin" />
					Enregistrement…
				</>
			) : (
				'Enregistrer'
			)}
		</Button>
	)
}
