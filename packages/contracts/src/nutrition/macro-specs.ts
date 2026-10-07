import type { MacroTargets } from './macro-targets'

type MacroSpecShape = { key: keyof MacroTargets; label: string }

export const MACRO_SPECS = [
	{ key: 'proteinG', label: 'Protéines' },
	{ key: 'carbsG', label: 'Glucides' },
	{ key: 'fatG', label: 'Lipides' },
] as const satisfies readonly MacroSpecShape[]

export type MacroSpec = (typeof MACRO_SPECS)[number]
export type MacroKey = MacroSpec['key']

export function macroRemainingMessage(
	label: string,
	consumedG: number,
	targetG: number,
): string | null {
	if (targetG <= 0) return null
	const macroName = label.toLocaleLowerCase('fr-FR')
	const missingG = Math.ceil(targetG - consumedG)
	if (missingG <= 0) return `Objectif ${macroName} atteint`
	return `Il te manque ${missingG} g de ${macroName}`
}
