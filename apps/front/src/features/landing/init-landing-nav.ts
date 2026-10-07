const SCROLLED_AFTER_PX = 8
const HIDE_AFTER_PX = 160
const SCROLL_DELTA_PX = 6

function setOpen(header: HTMLElement, isOpen: boolean): void {
	const toggle = header.querySelector<HTMLButtonElement>('[data-menu-toggle]')
	const menu = header.querySelector<HTMLElement>('[data-menu]')
	header.toggleAttribute('data-open', isOpen)
	header.removeAttribute('data-hidden')
	toggle?.setAttribute('aria-expanded', String(isOpen))
	menu?.toggleAttribute('inert', !isOpen)
}

function watchScroll(header: HTMLElement): void {
	let lastY = window.scrollY
	const update = (): void => {
		const y = window.scrollY
		header.toggleAttribute('data-scrolled', y > SCROLLED_AFTER_PX)
		if (
			header.hasAttribute('data-open') ||
			Math.abs(y - lastY) < SCROLL_DELTA_PX
		) {
			return
		}
		header.toggleAttribute('data-hidden', y > lastY && y > HIDE_AFTER_PX)
		lastY = y
	}
	update()
	window.addEventListener('scroll', update, { passive: true })
}

function watchMenu(header: HTMLElement): void {
	header
		.querySelector('[data-menu-toggle]')
		?.addEventListener('click', () =>
			setOpen(header, !header.hasAttribute('data-open')),
		)
	for (const link of header.querySelectorAll('[data-menu] a')) {
		link.addEventListener('click', () => setOpen(header, false))
	}
	document.addEventListener('keydown', event => {
		if (event.key === 'Escape') setOpen(header, false)
	})
}

export function initLandingNav(): void {
	const header = document.querySelector<HTMLElement>('[data-landing-nav]')
	if (!header) return
	watchScroll(header)
	watchMenu(header)
}
