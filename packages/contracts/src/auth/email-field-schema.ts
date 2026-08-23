import * as v from 'valibot'

export const EmailFieldSchema = v.pipe(
	v.string(),
	v.trim(),
	v.minLength(1, "L'email est obligatoire"),
	v.email("L'email n'est pas valide"),
)
