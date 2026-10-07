import { APP_NAME } from '@fitapp/contracts'
import { Card, CardDescription, CardTitle } from '@fitapp/ui'

import { ConnectorCopyField } from './connector-copy-field'

import type { ReactElement } from 'react'

type ApiTokenCardProps = {
	token: string | null
}

export function ApiTokenCard({ token }: ApiTokenCardProps): ReactElement {
	return (
		<Card id="assistant" className="scroll-mt-20">
			<CardTitle>Branche ton assistant</CardTitle>
			<CardDescription className="mt-1.5">
				ChatGPT, Claude et Gemini : connexion en 1 clic bientôt. En
				attendant, ta clé permet de connecter {APP_NAME} à ton
				assistant.
			</CardDescription>
			{token ? (
				<dl className="mt-5">
					<ConnectorCopyField label="Ta clé" text={token} />
				</dl>
			) : (
				<p className="text-muted-foreground mt-5 text-sm">
					Aucune clé disponible pour le moment.
				</p>
			)}
		</Card>
	)
}
