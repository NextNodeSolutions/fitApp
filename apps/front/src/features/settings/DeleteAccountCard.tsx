import { Button } from '@fitapp/ui'
import { Trash2 } from 'lucide-react'

import { DeleteAccountConfirmation } from './delete-account-confirmation'
import { useDeleteAccount } from './use-delete-account'

import type { ReactElement } from 'react'

export function DeleteAccountCard(): ReactElement {
	const {
		isConfirmingDelete,
		pending,
		failed,
		requestConfirm,
		cancelDelete,
		deleteAccount,
	} = useDeleteAccount()

	return (
		<div>
			<h3 className="text-[15px] font-medium tracking-tight">
				Supprimer mon compte
			</h3>
			{isConfirmingDelete ? (
				<DeleteAccountConfirmation
					pending={pending}
					onConfirm={() => {
						void deleteAccount()
					}}
					onCancel={cancelDelete}
				/>
			) : (
				<>
					<p className="text-muted-foreground mt-1 text-sm">
						Efface ton compte et toutes tes données.
					</p>
					<Button
						variant="outline"
						className="text-destructive hover:border-destructive/40 mt-4"
						onClick={requestConfirm}
					>
						<Trash2 />
						Supprimer mon compte
					</Button>
				</>
			)}
			{failed ? (
				<p role="alert" className="text-destructive mt-3 text-sm">
					La suppression a échoué, réessaie.
				</p>
			) : null}
		</div>
	)
}
