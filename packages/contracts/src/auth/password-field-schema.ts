import * as v from 'valibot'

import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from './constants'

export const PasswordFieldSchema = v.pipe(
	v.string(),
	v.minLength(1, 'Le mot de passe est obligatoire'),
	v.minLength(
		PASSWORD_MIN_LENGTH,
		`Le mot de passe doit contenir au moins ${PASSWORD_MIN_LENGTH} caractères`,
	),
	v.maxLength(
		PASSWORD_MAX_LENGTH,
		`Le mot de passe doit contenir au plus ${PASSWORD_MAX_LENGTH} caractères`,
	),
)
