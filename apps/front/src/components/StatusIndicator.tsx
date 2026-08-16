import { useState } from 'react'

import type { ReactElement } from 'react'

export function StatusIndicator(): ReactElement {
	const [count, setCount] = useState(0)

	return (
		<button type="button" onClick={() => setCount(count + 1)}>
			fitApp island React : {count}
		</button>
	)
}
