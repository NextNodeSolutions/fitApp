import { Button } from '@fitapp/ui'
import { Check, Copy } from 'lucide-react'

import type { ReactElement, Ref } from 'react'

type ApiTokenCopyButtonProps = {
	copied: boolean
	buttonRef: Ref<HTMLButtonElement>
	onCopy: () => void
}

export function ApiTokenCopyButton({
	copied,
	buttonRef,
	onCopy,
}: ApiTokenCopyButtonProps): ReactElement {
	return (
		<Button
			ref={buttonRef}
			type="button"
			variant="outline"
			onClick={onCopy}
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
	)
}
