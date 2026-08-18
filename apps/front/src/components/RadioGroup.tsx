import type { ReactElement } from 'react'

const MAX_COMPACT_OPTIONS = 3

export type RadioGroupOption = {
	value: string
	label: string
	hint?: string
}

export type RadioGroupProps = {
	label: string
	name: string
	selected: string
	options: RadioGroupOption[]
	onChange: (v: string) => void
	error: string | undefined
}

function OptionRow({
	opt,
	name,
	isSelected,
	onChange,
}: {
	opt: RadioGroupOption
	name: string
	isSelected: boolean
	onChange: (v: string) => void
}): ReactElement {
	return (
		<label
			className={`flex cursor-pointer items-center gap-2 rounded border p-3 ${
				isSelected
					? 'border-lime-500 bg-lime-900/30'
					: 'border-gray-600 bg-gray-800'
			}`}
		>
			<input
				type="radio"
				name={name}
				value={opt.value}
				checked={isSelected}
				onChange={e => onChange(e.target.value)}
				className="accent-lime-500"
			/>
			<div>
				<div className="text-sm font-medium text-white">
					{opt.label}
				</div>
				{opt.hint ? (
					<div className="text-xs text-gray-400">{opt.hint}</div>
				) : null}
			</div>
		</label>
	)
}

export function RadioGroup({
	label,
	name,
	selected,
	options,
	onChange,
	error,
}: RadioGroupProps): ReactElement {
	const isCompact = options.length <= MAX_COMPACT_OPTIONS

	return (
		<div>
			<span className="mb-2 block text-sm font-medium text-gray-300">
				{label}
			</span>
			<div className={isCompact ? 'flex gap-4' : 'space-y-2'}>
				{options.map(opt => (
					<OptionRow
						key={opt.value}
						opt={opt}
						name={name}
						isSelected={selected === opt.value}
						onChange={onChange}
					/>
				))}
			</div>
			{error ? (
				<p className="mt-1 text-xs text-red-400">{error}</p>
			) : null}
		</div>
	)
}
