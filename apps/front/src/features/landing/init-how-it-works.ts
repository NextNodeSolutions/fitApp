// Keeps the pinned phone in sync with the step crossing the middle of the viewport.
function stepIndex(element: Element): number | null {
	if (!(element instanceof HTMLElement)) return null
	const index = Number(element.dataset.howStep)
	if (!Number.isInteger(index)) return null
	return index
}

// Screens and step dots both carry data-phone-step.
function activate(index: number): void {
	for (const element of document.querySelectorAll<HTMLElement>(
		'[data-phone-step]',
	)) {
		element.toggleAttribute(
			'data-active',
			Number(element.dataset.phoneStep) === index,
		)
	}
}

export function initHowItWorks(): void {
	const steps = document.querySelectorAll('[data-how-step]')
	if (!steps.length) return
	const observer = new IntersectionObserver(
		entries => {
			for (const entry of entries) {
				const index = stepIndex(entry.target)
				if (entry.isIntersecting && index !== null) activate(index)
			}
		},
		{ rootMargin: '-50% 0px -50% 0px' },
	)
	for (const step of steps) observer.observe(step)
}
