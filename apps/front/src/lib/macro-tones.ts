import type { MacroKey } from '@fitapp/contracts'

// One colour per macro series (DESIGN.md): protéines ink, glucides brand, lipides lime.
export const MACRO_TONES: Record<MacroKey, 'ink' | 'brand' | 'lime'> = {
	proteinG: 'ink',
	carbsG: 'brand',
	fatG: 'lime',
}
