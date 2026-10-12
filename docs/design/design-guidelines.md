# design-guidelines.md: Pages, Motion, Accessibility, Copy

Read `DESIGN.md` first for tokens and hard rules. Component specs live in `design-components.md`.

## 1. Home page (MOTION 7, DENSITY 4)
Everything is reachable by scrolling alone. Each scene has a distinct layout family and a reason for its motion.

| #   | Scene                | Layout family                                                                                                      | Motion and its purpose                                                                                                                                |
| --- | -------------------- | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Hero**             | Asymmetric split: headline left (7 cols), duotone portrait right (5 cols, `--radius-sheet`)                        | One orchestrated load: headline reveals line by line (masked, 80ms stagger), portrait clip-path opens. Purpose: first impression. Then nothing loops. |
| 2   | **Tech strip**       | Single marquee (the only one on the page)                                                                          | Slow linear drift, pauses on hover and under reduced motion. Purpose: breadth of stack without individual attention.                                  |
| 3   | **About**            | Full-width statement, 3 to 4 sentences                                                                             | Scroll-scrubbed word-by-word fill from muted to ink. Purpose: pacing the reader through the story.                                                    |
| 4   | **Selected work**    | Pinned horizontal pan, 4 to 5 projects (GSAP, `start: "top top"`, pin wrapper, scrub inner track)                  | Each project card slides in with its image parallax. Purpose: sequence. Below `lg`: vertical list with scroll-snap, no pinning.                       |
| 5   | **Skills**           | Bento, exactly as many cells as skill groups (5 cells: 2+3), cells vary (photo, tinted, plain, code snippet, stat) | Staggered reveal once; hover tilt (max 4 degrees) via `useMotionValue`. Purpose: feedback.                                                            |
| 6   | **Experience**       | Vertical timeline (a real sequence, numbering allowed)                                                             | Connector line draws with scroll; active node gets `--highlight` ring. Purpose: chronology.                                                           |
| 7   | **Latest writing**   | Magazine trio: 1 large + 2 stacked                                                                                 | Soft image parallax only. Purpose: connect to blog.                                                                                                   |
| 8   | **Contact + footer** | Oversized type CTA, one button                                                                                     | Magnetic button (Motion values, max 8px pull). Purpose: invite action.                                                                                |

Hero stack (max 4 text elements): optional one small label, headline (2 lines max), subtext (20 words max), CTAs (1 primary "Contact me", 1 secondary "View work"). No trust strip, no tagline under CTAs.
Navigation: floating pill, hides on scroll down and returns on scroll up (state change feedback), active section indicator, thin scroll progress bar in `--primary`. Eyebrows: use at most on scenes 1, 4 and 7.

## 2. Blog index (MOTION 4, magazine layout)
```
Desktop (lg)
+--------------------------------------------------------+
| Nav                                          [Search /]|
+--------------------------------------------------------+
| h1 "Writing"        category chips: All  Backend  ...   |
+------------------------------+-------------------------+
| FEATURED (large, 7 cols)     | Featured 2 (5 cols)     |
|  cover + title + excerpt     | Featured 3 (5 cols)     |
+------------------------------+-------------------------+
| Latest (all categories): 1 wide + 3 standard, 12-col   |
+--------------------------------------------------------+
| Category A   [More]  -> layout A: 1 large + 2 small    |
| Category B   [More]  -> layout B: scroll-snap row       |
| Category C   [More]  -> layout C: compact list w/ thumb |
+--------------------------------------------------------+
```
- **Search:** pill field in the page header and `/` or Cmd/Ctrl+K opens a command-style dialog. Debounced (200ms), results grouped (Posts, Categories), highlighted match text uses `--highlight` at 35% opacity. Empty result state suggests categories.
- **Featured:** editor-picked, flagged with the amber "Featured" badge (one of the few amber uses).
- **Latest:** newest across categories, no repeats of featured items.
- **Category sections:** vary layout between categories (A, B, C above) so the page doesn't become repeated rows. Each header has the category name and a "More" pill button to the category page.
- Compact: single column; featured becomes a snap carousel; category rows become horizontal snap.
- Motion: opacity/translate reveal (16px, 480ms) once per card group, image scale 1.03 on card hover. No scrubbing.

## 3. Single post (MOTION 3)
```
Desktop (md+)
[progress bar]
Title (h1, left aligned)     meta: author, date, read time
Cover (sheet radius)
+--------+-----------------------------+----------------+
|Reaction|  Article body (68ch)        | Sticky TOC     |
| rail   |                             |                |
+--------+-----------------------------+----------------+
Author card -> Related posts (3) -> Comments
```
- **Reactions:** sticky vertical rail on `md+`; fixed bottom bar on compact. Six predefined emoji (see components). Optimistic updates.
- **Reading progress:** CSS scroll-driven bar, `--primary`.
- **TOC:** from h2/h3, highlights the current section, hidden below `md`.
- **Related:** 3 compact cards, same category first, then shared tags.
- **Comments:** composer on top, sort (Newest, Top), one nesting level, per-comment reactions using the same set.
- Code blocks: `--surface-2`, `--radius-field`, Geist Mono 0.9rem, copy button with "Copied" state.

## 4. Responsive rules
Every multi-column or pinned section declares its compact fallback. Touch targets at least 44px. Hover-only affordances need a tap or focus equivalent. Test at 360, 600, 840, 1200, 1600.

## 5. Dark mode
Default to system preference, with a toggle (icon button, cycles Light, Dark, System). Set the class in an inline script before paint to avoid flash. Images get `brightness(.92)` in dark. Shadows are replaced by borders. Verify contrast of `--highlight` and `--primary` on every surface.

## 6. Accessibility
- WCAG 2.2 AA. Focus ring: 2px `--primary`, 2px offset, never removed.
- `prefers-reduced-motion`: no pinning, no scrubbing, no marquee, no parallax; reveals become 150ms fades.
- Reactions are `<button aria-pressed>`; counts announced via `aria-live="polite"` on change.
- Skip link first in DOM; landmarks (`header`, `nav`, `main`, `article`, `aside`); heading order intact.
- Pinned scenes must not trap scroll or hide content from keyboard users; all projects remain reachable as links.
- Don't convey state by color alone (selected reaction also gets a ring and `aria-pressed`).

## 7. Imagery
Real imagery is mandatory: a portrait for the hero (duotone treatment with primary-900), project screenshots or real photography, a unique cover per post (16:9, `--radius-media`). Use labeled placeholders (`<!-- TODO: hero portrait 1600x2000 -->`) when assets are missing. No stock illustrations, no gradient blobs.

## 8. Voice and copy
First person, plain, specific. Sentence case. Buttons are verbs: "Contact me", "View work", "Read post", "More". Same action, same name everywhere. Errors say what happened and how to fix it ("Comment is empty. Write something to post."). Empty states invite action. No em dashes, no "→" in labels, no invented metrics (label sample numbers as sample).

## 9. Performance
Images via `next/image` with AVIF/WebP and blur placeholder; only animate `transform` and `opacity`; lazy-init GSAP only on the home route; LCP is the hero portrait (priority); target CLS 0.
