import { Button } from '@fitapp/ui'
import { LoaderCircle, LogOut } from 'lucide-react'

import { useSignOut } from './use-sign-out'

import type { ReactElement } from 'react'

export function LogoutButton(): ReactElement {
	const { signOut, pending, failed } = useSignOut()

	return (
		<div className="space-y-2">
			<Button
				type="button"
				variant="outline"
				disabled={pending}
				onClick={() => {
					void signOut()
				}}
			>
				{pending ? (
					<>
						<LoaderCircle className="animate-spin" />
						Déconnexion…
					</>
				) : (
					<>
						<LogOut />
						Se déconnecter
					</>
				)}
			</Button>
			{failed ? (
				<p role="alert" className="text-destructive text-sm">
					La déconnexion a échoué, réessaie.
				</p>
			) : null}
		</div>
	)
}
