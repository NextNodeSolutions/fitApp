import { Button } from '@fitapp/ui'
import { LoaderCircle } from 'lucide-react'

import type { ReactElement } from 'react'

type DeleteAccountConfirmationProps = {
	pending: boolean
	onConfirm: () => void
	onCancel: () => void
}

export function DeleteAccountConfirmation({
	pending,
	onConfirm,
	onCancel,
}: DeleteAccountConfirmationProps): ReactElement {
	return (
		<>
			<p className="text-muted-foreground mt-1 text-sm">
				Le profil, les pesées, le journal alimentaire et ta clé API
				seront supprimés définitivement. Cette action est irréversible.
			</p>
			<div className="mt-4 flex flex-wrap gap-2">
				<Button
					variant="destructive"
					disabled={pending}
					onClick={onConfirm}
				>
					{pending ? (
						<>
							<LoaderCircle className="animate-spin" />
							Suppression…
						</>
					) : (
						'Confirmer la suppression'
					)}
				</Button>
				<Button variant="outline" disabled={pending} onClick={onCancel}>
					Annuler
				</Button>
			</div>
		</>
	)
}
