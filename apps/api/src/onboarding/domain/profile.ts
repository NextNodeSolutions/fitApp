import type { OnboardingBody } from '@fitapp/contracts'

export type Profile = OnboardingBody & {
	sessionId: string
}
