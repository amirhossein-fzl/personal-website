# design-components.md: Component Specs

Tokens come from `DESIGN.md`. All components: semantic color tokens, shape lock radii, visible focus ring, dark mode parity, reduced-motion fallback.

## Button
| Variant     | Use                              | Style                                                   |
| ----------- | -------------------------------- | ------------------------------------------------------- |
| `primary`   | One per view (e.g. "Contact me") | `bg-primary text-on-primary`, pill                      |
| `secondary` | Supporting ("View work")         | 1px `--line` border, `bg-surface`, hover `bg-surface-2` |
| `ghost`     | Tertiary, inline                 | Transparent, hover `bg-primary-soft`                    |
Sizes: `sm` 36px, `md` 44px, `lg` 52px (label 3 words max, single line).
States: hover (bg shift + 120ms), active (`scale(.97)`), focus-visible (ring), disabled (50% opacity, `aria-disabled`), loading (label stays, inline progress dots, width locked).
Magnetic effect only on the home contact CTA.

## Chip / Tag / Filter
Pill, `bg-surface-2`, `small` text. Selected: `bg-primary-soft` + 1px `--primary` border. Filter chips are `<button aria-pressed>`; tags are links.

## Search field
Pill, 48px, label above or visually hidden `<label>`, `/` shortcut hint, clear button. Dialog variant: `role="dialog"`, `aria-modal`, results `role="listbox"`, arrow keys move, Enter opens, Esc closes and restores focus. States: empty, loading (3 skeleton rows), results, no results (suggest categories), error (inline, retry).

## Input / Textarea
Label above, helper below, error below with `--danger` text plus icon. Single-line = pill, multi-line = `--radius-field`. Focus: ring + border `--primary`. Never placeholder-as-label.

## Floating nav
Pill, `bg-surface/90` with 1px border (no blur dependency), links, theme toggle, "Contact me" button. Single line on `md+`; below that a menu button opens a full-height sheet. Hides on scroll down, shows on scroll up. `aria-current="page"`.

## Theme toggle
Icon button 44px, cycles Light, Dark, System with a spring icon swap. `aria-label` names the next state.

## Project card (home, pinned pan)
Media (`--radius-media`) on top, title (h3), one-line summary, stack chips (max 4), "View project" link. Hover: media scale 1.03, title underline draws. Compact: full-width stacked.

## Post card
| Variant    | Layout                                                   | Use                                 |
| ---------- | -------------------------------------------------------- | ----------------------------------- |
| `featured` | Cover 16:10, h3, excerpt, amber "Featured" badge         | Blog hero slots                     |
| `standard` | Cover 16:9, category chip, h4, date and read time (mono) | Latest grids                        |
| `compact`  | 72px square thumb, title, meta                           | Related posts, category list layout |
| `wide`     | Cover left, text right (md+)                             | First Latest slot                   |
Card = `--radius-card`, `bg-surface`, 1px `--line`; whole card is one link (`<a>` wraps title with stretched pseudo-element). Hover: cover scale 1.03 (480ms, `--ease-out`), border `--primary`. Loading: skeleton with the same cover ratio and text lines.

## Category section header
Category name (h2), optional count, "More" secondary pill button aligned right. Section layouts rotate (A: 1 large + 2 small, B: snap row, C: compact list).

## Reaction bar (posts and comments)
Predefined set (fixed order): thumbs up, heart, fire, clap, light bulb, mind blown (`👍 ❤️ 🔥 👏 💡 🤯`).
- Pill per emoji + count (`caption`, tabular numbers). Zero counts hidden on comments, shown on posts.
- Selected: `bg-primary-soft`, 1px `--highlight` ring, `aria-pressed="true"`.
- Interaction: tap toggles (one reaction per emoji per user, optimistic, rollback with toast on error). Selected emoji pops (scale 1 to 1.25 to 1, spring), count rolls vertically.
- Post: sticky vertical rail (md+) or bottom bar (compact). Comment: shows top 3 reactions plus an "Add reaction" pill opening a popover with all six (`role="menu"`, arrows to move, Enter to choose).
- Anonymous users: clicking opens the sign-in prompt. Announce count changes via `aria-live="polite"`.

## Comment
Avatar (pill), name, relative time, body (`--radius-card` bubble on `--surface-2`), actions (Reply, reactions). One nesting level. States: posting (dimmed + spinner dots), failed (inline retry), edited, deleted placeholder. Composer: textarea (min 3 rows), character hint, "Post comment" button disabled when empty.

## Related posts
Heading h2 "Keep reading", three `compact` or `standard` cards in a 3-col grid (`md+`), stacked on compact.

## Table of contents
Sticky (md+), h2/h3 links, current item has a 2px `--primary` left bar and `ink` text. Smooth scroll respects reduced motion.

## Code block
`--surface-2`, `--radius-field`, language label (mono), copy button (idle, "Copied" for 1.5s), horizontal scroll with focusable region (`tabindex="0"`).

## Toast
Bottom-center on compact, bottom-right on md+. Card radius, auto-dismiss 4s, pausable on hover, `role="status"` (errors `role="alert"`). Used for transient feedback only.

## Skeleton and empty states
Skeletons match final shapes, shimmer 1.4s (disabled under reduced motion). Empty states: one line of explanation and one action ("No posts in this category yet. Browse all posts.").

## Do and don't
| Do                                                 | Don't                                 |
| -------------------------------------------------- | ------------------------------------- |
| One primary button per view                        | Two primary CTAs with the same intent |
| Use skeletons shaped like content                  | Use circular spinners for page loads  |
| Keep radius from the shape table                   | Use `rounded-lg` or arbitrary radii   |
| Use amber for featured, selected ring, text marker | Fill buttons or links with amber      |
| Mark the whole card as one link                    | Nest multiple links inside cards      |
