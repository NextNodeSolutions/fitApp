import { useState } from 'react'

import { RadioGroup } from './RadioGroup'
import { TextInput } from './TextInput'
import { validateAllFields, validateOneField } from './validators'

import type { ReactElement } from 'react'

const MIN_HEIGHT = 100
const MAX_HEIGHT = 250
const MIN_WEIGHT = 30
const MAX_WEIGHT = 300
const MIN_AGE = 10
const MAX_AGE = 120

const ACTIVITY_LEVELS = [
	{ value: 'sedentary', label: 'Sédentaire', hint: "Peu ou pas d'exercice" },
	{ value: 'light', label: 'Légèrement actif', hint: '1 à 3 fois/semaine' },
	{
		value: 'moderate',
		label: 'Modérément actif',
		hint: '3 à 5 fois/semaine',
	},
	{ value: 'active', label: 'Actif', hint: '6 à 7 fois/semaine' },
	{
		value: 'very_active',
		label: 'Très actif',
		hint: 'Métier physique ou sport intensif',
	},
] as const

type FormData = {
	height: string
	weight: string
	age: string
	sex: string
	activityLevel: string
}

async function submitFormData(
	formData: FormData,
	setSubmitting: (v: boolean) => void,
	setServerError: (v: string) => void,
): Promise<void> {
	setSubmitting(true)
	setServerError('')
	try {
		const response = await fetch('/api/onboarding', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				height: Number(formData.height),
				weight: Number(formData.weight),
				age: Number(formData.age),
				sex: formData.sex,
				activityLevel: formData.activityLevel,
			}),
		})
		const body: { errors?: string[]; sessionId?: string } =
			await response.json()
		if (!response.ok) {
			setServerError(
				body.errors?.join(' ') || "Erreur lors de l'enregistrement",
			)
			return
		}
		if (body.sessionId)
			localStorage.setItem('fitapp_session', body.sessionId)
		window.location.href = '/dashboard'
	} catch {
		setServerError('Erreur de connexion au serveur')
	} finally {
		setSubmitting(false)
	}
}

const TEXT_FIELDS: {
	id: string
	label: string
	unit: string
	min: number
	max: number
	step?: string
	placeholder: string
}[] = [
	{
		id: 'height',
		label: 'Taille',
		unit: 'cm',
		min: MIN_HEIGHT,
		max: MAX_HEIGHT,
		placeholder: '175',
	},
	{
		id: 'weight',
		label: 'Poids',
		unit: 'kg',
		min: MIN_WEIGHT,
		max: MAX_WEIGHT,
		step: '0.1',
		placeholder: '72.5',
	},
	{
		id: 'age',
		label: 'Âge',
		unit: 'ans',
		min: MIN_AGE,
		max: MAX_AGE,
		placeholder: '28',
	},
]

export function OnboardingForm(): ReactElement {
	const [height, setHeight] = useState('')
	const [weight, setWeight] = useState('')
	const [age, setAge] = useState('')
	const [sex, setSex] = useState('')
	const [activityLevel, setActivityLevel] = useState('')
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [submitting, setSubmitting] = useState(false)
	const [serverError, setServerError] = useState('')
	const values: Record<string, string> = {
		height,
		weight,
		age,
		sex,
		activityLevel,
	}
	const setters: Record<string, (v: string) => void> = {
		height: setHeight,
		weight: setWeight,
		age: setAge,
		sex: setSex,
		activityLevel: setActivityLevel,
	}
	function updateError(name: string, value: string): void {
		const error = validateOneField(name, value)
		setErrors(prev => {
			if (error) return { ...prev, [name]: error }
			return Object.fromEntries(
				Object.entries(prev).filter(([k]) => k !== name),
			)
		})
	}
	function handleChange(name: string, value: string): void {
		const setter = setters[name]
		if (setter) setter(value)
		updateError(name, value)
	}
	async function handleSubmit(e: React.SyntheticEvent): Promise<void> {
		e.preventDefault()
		const allErrors = validateAllFields(Object.entries(values))
		setErrors(allErrors)
		if (Object.keys(allErrors).length > 0) return
		await submitFormData(
			{ height, weight, age, sex, activityLevel },
			setSubmitting,
			setServerError,
		)
	}
	return (
		<form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-6">
			{serverError ? (
				<div className="rounded bg-red-900/50 p-3 text-sm text-red-200">
					{serverError}
				</div>
			) : null}
			{TEXT_FIELDS.map(f => (
				<TextInput
					key={f.id}
					id={f.id}
					label={f.label}
					unit={f.unit}
					value={values[f.id]!}
					onChange={v => handleChange(f.id, v)}
					onBlur={() => updateError(f.id, values[f.id]!)}
					min={f.min}
					max={f.max}
					step={f.step}
					placeholder={f.placeholder}
					error={errors[f.id]}
				/>
			))}
			<RadioGroup
				label="Sexe"
				name="sex"
				selected={sex}
				options={[
					{ value: 'male', label: 'Homme' },
					{ value: 'female', label: 'Femme' },
				]}
				onChange={v => handleChange('sex', v)}
				error={errors.sex}
			/>
			<RadioGroup
				label="Niveau d'activité"
				name="activityLevel"
				selected={activityLevel}
				options={ACTIVITY_LEVELS.map(l => ({
					value: l.value,
					label: l.label,
					hint: l.hint,
				}))}
				onChange={v => handleChange('activityLevel', v)}
				error={errors.activityLevel}
			/>
			<button
				type="submit"
				disabled={submitting}
				className="w-full rounded bg-lime-500 px-4 py-2 font-medium text-black transition hover:bg-lime-400 disabled:opacity-50"
			>
				{submitting ? 'Enregistrement…' : 'Commencer mon suivi'}
			</button>
		</form>
	)
}
