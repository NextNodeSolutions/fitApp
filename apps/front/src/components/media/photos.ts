const WIDTH_SMALL = 640
const WIDTH_MEDIUM = 1024
const WIDTH_LARGE = 1600
const WIDTH_XLARGE = 2400

export const PHOTO_WIDTHS = [
	WIDTH_SMALL,
	WIDTH_MEDIUM,
	WIDTH_LARGE,
	WIDTH_XLARGE,
] as const

// Intrinsic size of the largest variant; credits in public/images/CREDITS.md.
export const PHOTOS = {
	'runner-park': { width: 2400, height: 1602 },
	'yoga-park': { width: 2400, height: 1350 },
	'band-park': { width: 2400, height: 1600 },
} as const

export type PhotoName = keyof typeof PHOTOS

export function photoUrl(name: PhotoName, width: number): string {
	return `/images/${name}-${width}.webp`
}
