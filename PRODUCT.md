# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

Mobile-first responsive web today (Astro front on Cloudflare Workers). A native mobile app is planned as the second way to run the product; the agent is the first.

## Stack

Astro 7 + React islands, Tailwind 4, shared design system `@fitapp/ui` (Base UI + CVA + lucide-react), Hono + D1 API, remote MCP server. Monorepo conventions live in AGENTS.md.

## Name

"fitApp" is a working name. Every user-facing occurrence must come from one constant so a rename is a one-line change.

## Users

Everyday people, from barely active to very sporty. Not a fitness-nerd tool: the person who abandoned MyFitnessPal because logging every gram was a chore is the reference user. Around 90% of visits are on a phone.

## Job

Know what you eat and how your weight moves, without filling forms. You tell your AI assistant what you ate ("deux œufs et un café au lait"), it logs it; you ask it how your week went, it answers with your numbers. The web dashboard (and later the mobile app) is where you glance at the day.

## Position

Agent-first nutrition and weight tracking, positioned against MyFitnessPal. The product plugs into the assistant the user already uses instead of being one more app to open.

- Today: a generic remote MCP server works (meal logging tool `log_meal`, per-user API token from the settings page).
- Soon: one-click plugins and setup instructions for OpenAI (ChatGPT), Anthropic (Claude) and Google (Gemini), plus instructions for any other MCP client (power users: Hermes and similar). The landing presents these as one-click from the three big assistants and open to others.
- Mobile app: announced as coming, no store links.

## Capabilities (true today)

- Email/password account, onboarding (height, weight, age, sex, activity level).
- Meals logged by the agent through MCP (name, kcal, protein/carbs/fat).
- Daily calorie target from Mifflin-St Jeor BMR × activity (TDEE), macro targets (protein 2 g/kg, fat 0.8 g/kg, carbs the rest), calories and macros of the day vs target, day navigation (shipping with the dashboard redesign).
- Weigh-ins with history and trend chart over 30/90/365 days.
- Settings: profile edit, metric/imperial units, API token, account deletion.

Not yet: weight goal (lose/maintain/gain), manual food entry on web, barcode scan, reminders, exports, pricing.

## Voice

French, tutoiement, warm and plain. Short sentences. No gym-bro hype, no guilt about food.

## Brand commitments

- Light mode.
- Main colour is green (health).
- Simple, clean, near-minimalist; large calm motion rather than explosive effects.
- Grass is the signature material: animations with grass that make an ordinary person want to try the app.
- The landing tells one story with a clear through-line, stays short (mobile), and is responsive-first.
- No price is shown anywhere for now.

## Constraints

- Never claim a capability, integration, customer or number that is not true. Agent integrations other than the generic MCP are "bientôt"/one-click framing agreed by the team.
- Cloudflare Workers free plan; D1 cost guardrails in AGENTS.md.
- Accessibility: WCAG AA contrast, reduced-motion fallback for every animation, keyboard reachable.
