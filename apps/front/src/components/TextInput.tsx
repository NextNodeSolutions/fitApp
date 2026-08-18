import type { ReactElement } from 'react'

export type TextInputProps = {
	id: string
	label: string
	unit: string
	value: string
	onChange: (v: string) => void
	onBlur: () => void
	min: number
	max: number
	step?: string
	placeholder: string
	error: string | undefined
}

export function TextInput({
	id,
	label,
	unit,
	value,
	onChange,
	onBlur,
	min,
	max,
	step,
	placeholder,
	error,
}: TextInputProps): ReactElement {
	return (
		<div>
			<label
				htmlFor={id}
				className="mb-1 block text-sm font-medium text-gray-300"
			>
				{label} ({unit})
			</label>
			<input
				id={id}
				type="number"
				min={min}
				max={max}
				step={step}
				value={value}
				onChange={e => onChange(e.target.value)}
				onBlur={onBlur}
				className={
					error
						? 'w-full rounded border border-red-500 bg-gray-800 p-2 text-white'
						: 'w-full rounded border border-gray-600 bg-gray-800 p-2 text-white'
				}
				placeholder={placeholder}
				aria-invalid={!!error}
			/>
			{error ? (
				<p className="mt-1 text-xs text-red-400">{error}</p>
			) : null}
		</div>
	)
}
