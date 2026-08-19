export const HEIGHT_LABEL = 'La taille'
export const WEIGHT_LABEL = 'Le poids'
export const AGE_LABEL = "L'âge"
export const SEX_LABEL = 'Le sexe'
export const ACTIVITY_LEVEL_LABEL = "Le niveau d'activité"

export function rangeMessage(label: string, min: number, max: number): string {
	return `${label} doit être entre ${min} et ${max}`
}
