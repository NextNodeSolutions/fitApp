import { Button } from '@fitapp/ui'
import { Check, Copy } from 'lucide-react'

import type { ReactElement, Ref } from 'react'

type ApiTokenCopyButtonProps = {
	copied: boolean
	buttonRef: Ref<HTMLButtonElement>
	onCopy: () => void
	/** Names what gets copied for screen readers, e.g. "Ta clé". */
	targetLabel: string
}

export function ApiTokenCopyButton({
	copied,
	buttonRef,
	onCopy,
	targetLabel,
}: ApiTokenCopyButtonProps): ReactElement {
	return (
		<Button
			ref={buttonRef}
			type="button"
			variant="outline"
			className="w-28"
			onClick={onCopy}
		>
			{copied ? (
				<>
					<Check className="text-brand-ink" />
					Copié !
				</>
			) : (
				<>
					<Copy />
					Copier
				</>
			)}
			<span className="sr-only">{targetLabel}</span>
		</Button>
	)
}
