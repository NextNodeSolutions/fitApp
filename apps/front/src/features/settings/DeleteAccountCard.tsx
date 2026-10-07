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
		<div className="border-destructive/50 rounded-lg border bg-gray-900 p-6">
			<h2 className="text-lg font-semibold">Supprimer mon compte</h2>
			{isConfirmingDelete ? (
				<DeleteAccountConfirmation
					pending={pending}
					onConfirm={() => {
						void deleteAccount()
					}}
					onCancel={cancelDelete}
				/>
			) : (
				<Button
					variant="outline"
					className="border-destructive/50 text-destructive"
					onClick={requestConfirm}
				>
					<Trash2 />
					Supprimer mon compte
				</Button>
			)}
			{failed ? (
				<p role="alert" className="text-destructive mt-3 text-sm">
					La suppression a échoué, réessaie.
				</p>
			) : null}
		</div>
	)
}
