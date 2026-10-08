# Design system

Light, clean, product-first. References: see-for-yourself.com (white ground, product shown in a pinned phone, one accent), theperformancelab.ca and xnrgyclub.com (real people outdoors, large grotesk type, hairline lists). The product must read as wellness at first glance: real photography of people being active outdoors, food, and the product UI itself.

Source of truth for tokens: `packages/ui/src/index.css`. Components: `packages/ui/src/components/`.

## Colour

| Token                      | Value                 | Use                                                                 |
| -------------------------- | --------------------- | ------------------------------------------------------------------- |
| `background`               | `#ffffff`             | Page ground                                                         |
| `foreground`               | `#0b0e0c`             | Text, dark buttons, inverse cards                                   |
| `card` / `muted`           | `#f4f5f3`             | Surfaces (cards, tiles, day pills)                                  |
| `secondary`                | `#eceeea`             | Progress tracks, hovers, separators inside cards                    |
| `muted-foreground`         | `#5a625d`             | Secondary text (AA on white and on `card`)                          |
| `border`                   | `#e5e7e3`             | Hairlines                                                           |
| `primary` / `brand`        | `#2dd068`             | The one accent: primary CTA (ink text on it), progress, status dots |
| `brand-ink`                | `#0f7a3a`             | Green text/strokes on white (AA)                                    |
| `brand-soft`               | `#e3f8ea`             | Positive badges, selection                                          |
| `lime`                     | `#b8e986`             | Third data series (lipides)                                         |
| `warning` / `warning-soft` | `#a85513` / `#fbeee2` | Calorie surplus                                                     |
| `destructive`              | `#c42d1f`             | Errors, account deletion                                            |

Restrained strategy: neutrals plus one green. Green never carries body text; on white use `brand-ink`. Macro series: protéines = ink, glucides = brand, lipides = lime.

## Type

- Geist Variable (self-hosted via `@fontsource-variable/geist`) for everything; Geist Mono only for data labels (times, step numbers, tool-result headers).
- Display: weight 500, tracking `-0.04em` to `-0.045em`, leading `1.02`. Landing H1 `2.65rem` mobile → `5.25rem` desktop. Section H2 `2.1rem` → `3.75rem`. App page H1 `2rem` → `2.25rem`.
- Big numbers (kcal, kg): weight 500, tracking `-0.05em`, `tabular-nums`.
- Body 15-17px, `text-muted-foreground` for secondary copy. Measure ≤ 40ch for leads.
- No eyebrow/kicker above headings. French copy, tutoiement. Lint forbids typographic characters (NBSP, « », ’, dashes) inside code strings: keep them in markup (`&nbsp;`) or rephrase.

## Shape and space

- Cards: `rounded-3xl`, `p-5 sm:p-6`, tone `muted` (default), `inverse` (dark call to action) or `outline` (quiet hint). Never nest cards.
- Inner tiles (inside a card or the phone): `rounded-2xl`.
- Buttons: fully rounded, heights 36/44/52px. Variants: `default` (green, primary CTA), `dark`, `outline`, `secondary`, `ghost`, `destructive`, `link`.
- Inputs: 48px high, `rounded-lg` (14px), focus = ink border + `brand-soft` ring.
- Gaps: cards `gap-3` mobile / `gap-4` desktop. Page gutter 16px mobile, 24/32px above.
- Hairlines (`border-border`, `divide-secondary`) separate rows; no coloured side borders, no shadows on cards. Shadows only on floating objects over photos (chat bubble, notification) and on the phone mockup.

## Navigation

- Landing: transparent bar over white, becomes `bg-background/85` + blur + hairline after 8px of scroll, hides on scroll down after 160px and returns on scroll up. Links use `NavLink` (underline grows from the left on hover, retracts to the right). Mobile: two-line icon morphing into a cross, menu expands with a `grid-template-rows` transition, `inert` while closed.
- App: header with wordmark, `NavLink` items (desktop) and account initial; mobile uses a native-style bottom tab bar (icon + label, hairline top, safe-area padding).

## Motion

One purposeful moment per surface, all disabled under `prefers-reduced-motion`:

- Landing hero: heading, lead and actions rise in; the chat bubble then the "Déjeuner noté" notification appear over the photo.
- How it works (desktop): the phone stays pinned while steps scroll; the matching screen fades/slides in, step dots follow.
- Outdoor banner: the photo settles from 110% to 100% with a CSS scroll-driven animation (progressive enhancement).
- Progress bars grow once on load (`progress-grow`, CSS only).
- Easing `cubic-bezier(0.22, 1, 0.36, 1)`; durations 300-900ms. No decorative loops.

## Imagery

- Real photos of adults being active outdoors (Pexels licence, see `apps/front/public/images/CREDITS.md`). Never minors.
- Served as pre-sized WebP variants (640/1024/1600/2400) through `ResponsivePhoto` with `srcset`/`sizes`; no runtime image service.
- Product truth over decoration: demo screens use the real calculation rules (BMR/TDEE, macro targets, ±50 kcal balance) on clearly synthetic data (`features/landing/demo-data.ts`).

## Data display

- Calories: big consumed number, progress against the target (`warning` tone when in surplus), status badge (`En déficit` / `À l'équilibre` / `En surplus`) and remaining message.
- Week: seven day pills with a small progress bar each; future days dashed and inert.
- Weight: current value, delta badge over 30 days, area sparkline (`brand-ink` stroke, `brand/15` fill).

## Naming

The product name is provisional: every user-facing occurrence reads `APP_NAME` from `@fitapp/contracts`.
