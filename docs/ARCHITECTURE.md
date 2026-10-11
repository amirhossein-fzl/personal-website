# ARCHITECTURE.md

> **TL;DR** — This file is the technical source of truth for the project: stack, folder structure, aliases, API wrappers, i18n mechanics, RTL strategy, and testing commands. Read it before writing code. It does not cover agent operating rules (see `AGENTS.md`) or design philosophy (see `docs/design/DESIGN.md`).
>
> **Read first:** Section 1 (Overview), Section 3 (Structure), Section 6 (API), Section 7 (i18n/RTL). Then dive into whichever section is relevant to your task.

## Table of Contents
- [ARCHITECTURE.md](#architecturemd)
  - [Table of Contents](#table-of-contents)
  - [1. Project Overview](#1-project-overview)
  - [2. Stack](#2-stack)
  - [3. Project Structure](#3-project-structure)
  - [4. Setup Commands](#4-setup-commands)
  - [5. Imports \& Aliases](#5-imports--aliases)
  - [6. Fetching Data — `$api` and `useApi`](#6-fetching-data--api-and-useapi)
    - [Which to use](#which-to-use)
    - [Where they live](#where-they-live)
    - [Semantics](#semantics)
    - [Error handling convention](#error-handling-convention)
  - [7. Internationalization \& RTL](#7-internationalization--rtl)
    - [Translation files](#translation-files)
    - [Usage](#usage)
    - [`dir` / `lang` attribute strategy](#dir--lang-attribute-strategy)
  - [8. State Management](#8-state-management)
  - [9. Styling](#9-styling)
  - [10. Testing](#10-testing)
  - [11. Environment \& Configuration](#11-environment--configuration)
  - [12. Coding Standards](#12-coding-standards)
    - [General](#general)
    - [TypeScript](#typescript)
    - [Vue](#vue)

---

## 1. Project Overview

A personal portfolio and blog site built with Nuxt. Its purpose is to showcase and present the developer and publish articles.

- **Frontend**: Nuxt (this repo)
- **Blog backend**: Separate project (outside this repo). No backend logic lives here.
- **Language**: Multi-language (i18n) — English and Persian. The site is LTR/RTL.

## 2. Stack

- **Frameworks**: Vue 3, Nuxt 4
- **Language**: TypeScript
- **Store**: Pinia
- **UI**: Tailwind CSS, Reka UI
- **Icons**: Lucide
- **Routing**: Nuxt router
- **Testing**: Vitest, `@nuxt/test-utils`, `@vue/test-utils` (unit/component), Playwright (e2e).
- **Package manager**: pnpm

> SSR, Nitro, and `routeRules` are standard Nuxt concepts. Refer to the official Nuxt docs for how they work. Do not change them in `nuxt.config.ts` without flagging the change (see `AGENTS.md` §5).

## 3. Project Structure

We follow Nuxt's default architecture. The project is in early development; the default structure avoids unnecessary complexity.

**Important**:
1. Do not change the folder structure without a valid reason.
2. Update this section only when the *structure* changes — not when files inside purpose-built directories (`app/pages`, `app/components`, `public`, etc.) change.
3. **Nuxt 4 note**: This project uses the `app/` directory convention. Do not move files into `src/`.

[Project Root]/
.
├── .vscode                             # VS Code workspace settings for consistent editor behavior across the team.
│   └── settings.json                   # Project-specific VS Code settings (formatting, linting, extensions).
├── app                                 # Main Nuxt application directory containing UI code.
│   ├── components                      # Reusable Vue components.
│   ├── composables                     # Shared logics Vue composables.
│   │   └── useApi.ts                   # `useApi` wrapper around `useFetch`.
│   ├── layouts                         # Shared layout wrappers for pages.
│   ├── pages                           # File-based routing pages for the app.
│   │   └── index.vue                   # Home page of the application.
│   └── app.vue                         # Root Vue component that wraps every page.
├── assets                              # Assets processed by the bundler (CSS, images, fonts).
│   └── css                             # Global stylesheets for the project.
│       └── main.css                    # Main global CSS entry (e.g. Tailwind base and custom styles).
├── docs                                # Project documentation for developers and AI agents.
│   ├── design                          # Design system and UI documentation.
│   │   ├── DESIGN.md                   # High-level product design and UX decisions.
│   │   ├── design-components.md        # Catalog and usage of design system components.
│   │   └── design-guidelines.md        # Style guide: colors, typography, spacing, and rules.
│   └── ARCHITECTURE.md                 # Project architecture, data flow, and technical decisions.
├── locales                             # Translation files for internationalization (i18n).
│   ├── en.json                         # English translations.
│   └── fa.json                         # Persian (Farsi) translations.
├── public                              # Static files served as-is without bundler processing.
│   ├── llms.txt                        # Guidance file for LLM agents to understand the project.
│   └── robots.txt                      # Crawler rules for search engine bots.
├── stores                              # Pinia stores for global state management.
├── test                                # Test suites organized by testing layer.
│   ├── e2e                             # End-to-end tests (e.g. Playwright).
│   ├── nuxt                            # Nuxt-environment tests for components with real runtime.
│   └── unit                            # Unit tests for isolated functions and logic.
├── utils                               # Auto-imported helper utilities used across the project.
│   └── api.ts                          # Wrapped $fetch with backend api base url.
├── .gitignore                          # Files and folders excluded from Git tracking.
├── .nuxtrc                             # Project-level Nuxt rc configuration.
├── AGENTS.md                           # Rules and instructions for AI agents working on this repo.
├── README.md                           # Project overview, setup, and usage instructions.
├── eslint.config.mjs                   # ESLint configuration for code linting.
├── nuxt.config.ts                      # Main Nuxt config (modules, runtimeConfig, routing, etc.).
├── opencode.jsonc                      # OpenCode tool configuration for agent collaboration.
├── package.json                        # Project metadata, scripts, and dependency list.
├── pnpm-lock.yaml                      # Locked dependency versions for pnpm.
├── pnpm-workspace.yaml                 # Workspace definition for multi-package setups.
├── tsconfig.json                       # TypeScript compiler configuration.
└── vitest.config.ts                    # Vitest test runner configuration.

## 4. Setup Commands

- Install: `pnpm install`
- Dev server: `pnpm dev` → http://localhost:3000
- Build: `pnpm build`
- Preview production build: `pnpm preview`

## 5. Imports & Aliases

Prefer aliases over long relative paths.

| Path             | Alias      | Notes                                   |
| ---------------- | ---------- | --------------------------------------- |
| Root project     | `@@/`      | e.g. `@@/nuxt.config.ts`                |
| `app/`           | `@/`       | e.g. `@/components/...`                 |
| `utils/`         | `@utils/`  | e.g. `@utils/api`                       |
| `stores/`        | `@stores/` | e.g. `@stores/user`                     |

**Auto-imports (Nuxt 4)**:
- Vue APIs (`ref`, `computed`, `watch`, `onMounted`, etc.) and Nuxt APIs (`useFetch`, `useHead`, `useRoute`, `navigateTo`, etc.) are auto-imported. Do **not** write `import { ref } from 'vue'` unless there is a specific reason.
- Everything under `app/components/` and `app/composables/` is auto-imported by name. Nested directories are flattened into the component name (e.g. `app/components/ui/Button.vue` → `<UiButton />`, unless configured otherwise). Check `nuxt.config.ts` for any `components` overrides before assuming a name.
- Everything under `utils/` is auto-imported as a plain function (e.g. `utils/api.ts` exports `$api`, usable anywhere without import).
- **Exceptions — import explicitly when**:
  - The auto-imported name collides with a locally defined symbol.
  - You need a type-only import (`import type { ... }`).
  - You are inside a plain `.ts` file outside Nuxt's auto-import scope (e.g. a test setup file or `vitest.config.ts`).
- When in doubt about whether something is auto-imported, check the generated `.nuxt/imports.d.ts`. Do not edit files under `.nuxt/`.

## 6. Fetching Data — `$api` and `useApi`

The backend is a **separate project**. All communication is HTTP.

### Which to use
- **`$api`** — for **actions**: POST / PUT / PATCH / DELETE, form submissions, anything that mutates state or is triggered by user interaction.
- **`useApi`** — for **data fetching** in `setup` / composables. Wraps `useFetch` for SSR-friendly data loading.

### Where they live
- `$api` is implemented in `utils/api.ts`.
- `useApi` is implemented in `app/composables/useApi.ts`.

### Semantics
Both are **thin wrappers** around Nuxt's native `$fetch` and `useFetch`. Their inputs, outputs, and behavior are identical to the originals. The **only** differences are:
1. The backend base URL (`runtimeConfig.public.apiBaseUrl`) is pre-applied.
2. Any project-wide headers or defaults that `utils/api.ts` / `app/composables/useApi.ts` set.

Because the signatures match Nuxt's originals, refer to the Nuxt docs for `$fetch` and `useFetch` for options like `method`, `body`, `query`, `headers`, `lazy`, `key`, etc. Do not reimplement these wrappers, and never call the backend URL directly.

### Error handling convention
- **Form validation / field-level errors (typically 400/422)**: render **inline**, beneath the relevant input field.
- **All other errors (400s not tied to a field, 401/403, 5xx, network failures)**: surface via **toast**, depending on where the request originated.
- Do not swallow errors silently. Always give the user feedback.
- Do not add a new toast system — reuse the existing one.

## 7. Internationalization & RTL

### Translation files
- `locales/en.json` — English.
- `locales/fa.json` — Persian (Farsi).
- Keys are grouped by feature (e.g. `home.hero.title`).
- Every user-facing string must exist in **both** files.
- Whenever you want to add new text to the code, first check the local files to ensure it doesn't already exist.

### Usage
- **Inside a component's `<script setup>` or template**: use `$t('key')` directly (available via the i18n plugin).
- **Outside a component** (composables, utils, plain TS): call `useI18n()` and destructure `t`, then use `t('key')`.

### `dir` / `lang` attribute strategy
The `<html>` element must reflect the active locale:

```ts
// in app.vue
const { locale } = useI18n()

useHead({
  htmlAttrs: {
    lang: computed(() => locale.value),
    dir:  computed(() => (locale.value === 'fa' ? 'rtl' : 'ltr')),
  },
})
```

- Tailwind's logical properties (`ps-*`, `pe-*`, `ms-*`, `me-*`, `start-*`, `end-*`) automatically respect `dir`, so **prefer them over physical ones**.
- Use `rtl:` / `ltr:` variants only when a logical property doesn't cover the case (e.g. mirroring an icon, a decorative transform).
- Font, size, and similar adjustments per locale can be driven by the `dir` attribute (or `[lang="fa"]` / `[lang="en"]` selectors).

## 8. State Management

- **Pinia** for global and cross-component state. Do not use it for local component state.
- Stores live in `stores/`.
- Use **setup-style stores**: `defineStore('name', () => { ... })`.
- The entire project uses the Composition API with `<script setup lang="ts">`. Do not use the Options API.
- Pinia works with SSR out of the box (state is serialized into the payload and rehydrated on the client). Follow Nuxt's Pinia guidance — do not manually persist or rehydrate.

## 9. Styling

- **Tailwind CSS** is the primary styling tool. Do not create new `.css` files unless strictly necessary.
- **Avoid inline CSS** unless you have to.
- Use Tailwind logical properties for RTL/LTR compatibility (see §7).
- Component styles must be scoped. Global styles belong in `assets/css/main.css`.
- **Dynamic classes**:
  - Prefer Vue's `:class` binding.
  - If that's not enough, use `clsx`.
- **Variants**: use `class-variance-authority` (cva).
- **Class conflicts**: resolve with `tailwind-merge`.
- **Design tokens**: use them instead of hardcoded values. See `docs/design/design-guidelines.md`.

## 10. Testing

- Run **all** tests (unit + Nuxt-runtime + Playwright e2e): `pnpm test`
- Run a single test by name: `pnpm test -- -t "<test_name>"`
- **Rule**: After any logical change, run `pnpm test` and fix failures before claiming completion.
- **Rule**: Add or update tests for any code you change.
- Playwright is part of `pnpm test`. Do not skip it. If a browser needs installing locally, run `pnpm exec playwright install` once.

## 11. Environment & Configuration

- The backend base URL is exposed to the client through `runtimeConfig.public.apiBaseUrl`.
- Its value is read from the environment variable **`API_BASE_URL`**.
- `.env` files are **gitignored**. Never commit `.env`, keys, or tokens.
- Do not modify `runtimeConfig`, `modules`, or `routeRules` in `nuxt.config.ts` without flagging the change (see `AGENTS.md` §5).

## 12. Coding Standards

### General
- **Named exports only**. Never use default exports.
- Keep changes small and focused. One PR = one goal.
- Do not introduce a new dependency without justification.

### TypeScript
- Use `interface` for object shapes; `type` for unions, intersections, and primitives.
- **No `any`**. No `@ts-ignore`. If you're tempted, ask.

### Vue
- Prefer `<script setup lang="ts">`.
- Keep props and emits explicitly typed; avoid implicit event contracts.
- Use composables for shared logic; avoid duplication across components.
- Keep components focused; separate UI from orchestration when complexity grows.
- Handle loading, empty, success, and error states explicitly (see §6 for error UX).
- Avoid direct DOM manipulation unless required and isolated.
- Ensure interactive controls are keyboard accessible and screen-reader friendly.
- Prefer predictable, deterministic rendering to reduce hydration and SSR issues.
- Each component should have a single responsibility.
