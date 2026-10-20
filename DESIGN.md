# Vibecoding Project Tracker — Design

**Status:** M3 design decisions completed · ready for implementation.

**Why this file exists.** This tracker is your tool. It should look like *your* tool — not a generic Kanban with default Tailwind blue. Twenty minutes of design decisions here will be visible on every screen for the next six weeks of Module 5.

**Who owns this.** Person B, during the same window the rest of the team is reviewing the PRD. By the time the team converges to start M4 (`data-model`), this file should be filled in and the colors should already be in `tailwind.config.js`.

---

## 1. Mood / vibe

One sentence that captures the feeling the tracker should leave you with.

Calm, focused, and slightly technical: a workspace that helps developers turn rough AI-assisted ideas into visible progress.

Two or three references that capture the vibe (links to dribbble shots, screenshots of apps you admire, Pinterest boards — anything visual):

- [Linear](https://linear.app/method) for its focused project-management layout and clear status hierarchy.
- [GitHub Projects](https://github.com/features/issues) for its practical developer workflow and information density.
- [Raycast](https://www.raycast.com/) for its restrained interface, keyboard-friendly feel, and developer-oriented tone.

Anti-references — what we are explicitly **not** trying to look like:

- Generic project-management dashboards with excessive cards, gradients, decorative illustrations, or corporate blue styling.

## 2. Color palette

These are the colors the build milestones will reference. Once chosen, paste the hex values into `tailwind.config.js` so the rest of the team can use Tailwind utility classes (e.g. `bg-brand-primary`, `border-due-warning`).

### Brand

| Token | Hex | Where it shows up |
|---|---|---|
| `brand-primary` | `#6D5EF5` | Header, "+" button, focus rings |
| `brand-accent` | `#A78BFA` | Highlights, hover states, links |
| `surface-page` | `#F5F7FB` | Page background |
| `surface-card` | `#FFFFFF` | Card background |
| `text-primary` | `#172033` | Body text |
| `text-muted` | `#667085` | Captions, dates, counts |

### Task type (M6 `tag-style`)

| Token | Hex | When used |
|---|---|---|
| `type-feature` | `#0F9D78` | Cards tagged `feature` (accent stripe + icon) |
| `type-bug` | `#E05252` | Cards tagged `bug` (accent stripe + icon) |

### Due-date states (M8 `due-tint`)

| Token | Hex | When used |
|---|---|---|
| `due-safe` | `#D9F3E8` | More than 2 days out |
| `due-warning` | `#FFF0C2` | Less than 24 hours |
| `due-overdue` | `#FAD7D7` | Past due |
| `due-neutral` | `#E8ECF2` | Done (overrides date) |

## 3. Typography

| Role | Font | Why |
|---|---|---|
| Heading | `Inter` | A clear, modern sans-serif that gives the product a focused technical feel. |
| Body | `Inter` | The same family keeps task information readable and reduces visual noise. |
| Monospace (tags, badges, code) | `JetBrains Mono` | It reinforces the connection to prompts, code, technical labels, and developer workflows. |

Suggested sizes (override only if the design demands it):

- Page title: 24 px / semibold
- Section header: 16 px / semibold uppercase
- Card title: 14 px / medium
- Body: 14 px / regular
- Caption: 12 px / regular muted

## 4. Component principles

One short sentence per element. These set the tone for the build phase — Person A's modal and Person B's anchor board should both feel like they came from this doc.

- **Cards:** Use a white surface, a thin border, and a small coloured type stripe, with a subtle lift only on hover.
- **Buttons:** Use solid colour, clear labels, medium rounding, and a visible hover or focus state.
- **Modal:** Use a centred, medium-width form over a dark translucent backdrop with a clear title and grouped fields.
- **Empty states:** Use a dashed border and encouraging, task-focused copy without decorative illustrations.
- **Drag affordance (if used):** Do not use drag and drop for the MVP; use the status dropdown so the interaction stays predictable.

## 5. Voice / microcopy

Three lines of microcopy that capture the tone of the product. Keep it short — these are the words a stressed user reads at 11pm.

| Where | Text |
|---|---|
| "+" button label | `+ Add task` |
| Empty column placeholder | `No tasks here yet. Keep the flow moving.` |
| Toast after "Copy as Prompt Context" | `Copied. Ready to paste into your AI tool.` |
| Confirm-delete message | `Delete this task? This cannot be undone.` |
| Handoff toast (M7 `task-owner`) | `Task handed off to {name}.` |

## 6. Logo / wordmark

The tracker probably doesn't need a logo, but it does need a name and a wordmark style.

- **Product name:** `VibeFlow` (match PRD §11 team identity)
- **Wordmark style:** Use the name in the heading font with semibold weight and `brand-primary` colour; use no separate logo icon in the MVP.

## 7. Out of scope (this hackathon)

To keep design tight, the following are explicitly not part of `design-done`:

- A dark mode toggle. Pick one mode and ship it.
- Multiple themes. One brand, applied consistently.
- Animations beyond a 200 ms fade on toast notifications.
- A custom icon set. Use [Lucide icons](https://lucide.dev) via Tailwind classes if you need any.

---

*DESIGN.md version: hackathon-starter v1*
