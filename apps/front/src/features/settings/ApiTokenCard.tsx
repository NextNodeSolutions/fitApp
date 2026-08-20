import { Button } from '@fitapp/ui'
import { Check, Copy } from 'lucide-react'

import { useApiTokenCopy } from './use-api-token-copy'

import type { ReactElement } from 'react'

type ApiTokenCardProps = {
	token: string | null
}

export function ApiTokenCard({ token }: ApiTokenCardProps): ReactElement {
	const { copied, copyButtonRef, copyToken } = useApiTokenCopy()

	return (
		<div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
			{token ? (
				<>
					<p className="mb-2 text-sm text-gray-400">Ta clé API</p>
					<code className="block rounded-md border border-gray-700 bg-gray-950 p-3 font-mono text-xs break-all text-lime-400 sm:text-sm">
						{token}
					</code>
					<div className="mt-4 flex justify-end">
						<Button
							ref={copyButtonRef}
							type="button"
							variant="outline"
							onClick={() => {
								void copyToken(token)
							}}
						>
							{copied ? (
								<>
									<Check />
									Copié !
								</>
							) : (
								<>
									<Copy />
									Copier
								</>
							)}
						</Button>
					</div>
				</>
			) : (
				<p className="text-center text-gray-400">
					Aucune clé API disponible
				</p>
			)}
		</div>
	)
}
