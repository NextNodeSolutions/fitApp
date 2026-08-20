import type { OnboardingBody } from '@fitapp/contracts'

export type Profile = OnboardingBody & {
	sessionId: string
}

export type OwnedProfile = Profile & {
	userId: string
	apiToken: string
}
