import { ApiTokenCopyButton } from './ApiTokenCopyButton'
import { useApiTokenCopy } from './use-api-token-copy'

import type { ReactElement } from 'react'

type ConnectorCopyFieldProps = {
	label: string
	text: string
}

export function ConnectorCopyField({
	label,
	text,
}: ConnectorCopyFieldProps): ReactElement {
	const { copied, copyButtonRef, copyToken } = useApiTokenCopy()

	return (
		<div>
			<dt className="text-sm font-medium">{label}</dt>
			<dd className="mt-2 flex items-center gap-2">
				<code className="border-border bg-background min-w-0 flex-1 rounded-lg border px-4 py-3 font-mono text-[13px] leading-5 break-all">
					{text}
				</code>
				<ApiTokenCopyButton
					copied={copied}
					buttonRef={copyButtonRef}
					targetLabel={label}
					onCopy={() => {
						void copyToken(text)
					}}
				/>
			</dd>
		</div>
	)
}
