import { API_TOKEN_BYTE_LENGTH } from '@fitapp/contracts'

const HEXADECIMAL_RADIX = 16
const HEX_BYTE_WIDTH = 2

export function generateApiToken(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(API_TOKEN_BYTE_LENGTH))
	return Array.from(bytes, byte =>
		byte.toString(HEXADECIMAL_RADIX).padStart(HEX_BYTE_WIDTH, '0'),
	).join('')
}
