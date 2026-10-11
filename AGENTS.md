# AGENTS.md

> **TL;DR** — Operating manual for AI agents on this repo. It covers reading order, golden rules, hard "no" list, UI workflow, commit/PR rules, and checklists. It does **not** cover technical details — those live in `ARCHITECTURE.md` (stack, structure, API, i18n, RTL, testing and etc.) and `docs/design/DESIGN.md` (design philosophy).
>
> **Read first:** the TL;DR you are reading, then Section 1 (Reading order), then Section 4 (Golden rules). Only after that dive into the referenced docs.

## Table of Contents
- [AGENTS.md](#agentsmd)
  - [Table of Contents](#table-of-contents)
  - [1. Reading Order (Very Important!)](#1-reading-order-very-important)
  - [2. Project Identification](#2-project-identification)
  - [3. Project Overview (Short)](#3-project-overview-short)
  - [4. Golden Rules](#4-golden-rules)
    - [4.1 Before making changes](#41-before-making-changes)
    - [4.2 During the change](#42-during-the-change)
    - [4.3 After the change](#43-after-the-change)
  - [5. Hard No / Never](#5-hard-no--never)
  - [6. Working on the UI](#6-working-on-the-ui)
  - [7. Commit \& PR Rules](#7-commit--pr-rules)
    - [7.1 Commit message format (Conventional Commits)](#71-commit-message-format-conventional-commits)
    - [7.2 PR checklist](#72-pr-checklist)
  - [8. Final Pre-Delivery Checklist](#8-final-pre-delivery-checklist)
  - [9. When You Get Stuck](#9-when-you-get-stuck)
  - [10. Commit Granularity \& Atomicity](#10-commit-granularity--atomicity)
    - [10.1 Keep changes small](#101-keep-changes-small)
    - [10.2 Every commit must be flawless](#102-every-commit-must-be-flawless)
    - [10.3 Rules that follow from this](#103-rules-that-follow-from-this)
    - [10.4 Practical checklist before creating each commit](#104-practical-checklist-before-creating-each-commit)

---

## 1. Reading Order (Very Important!)

| Order | File                               | Contains                                                          | When                            |
| ----- | ---------------------------------- | ----------------------------------------------------------------- | ------------------------------- |
| 1     | `ARCHITECTURE.md`                  | Project structure, stack, coding standards, technical constraints | Always                          |
| 2     | `AGENTS.md` (this file)            | Agent operating rules, limitations, checklists                    | Always                          |
| 3     | `docs/design/DESIGN.md`            | Design philosophy and general principles                          | Before working on the UI        |
| 4     | `docs/design/design-guidelines.md` | Colors, typography, spacing, and design rules                     | Before choosing any style       |
| 5     | `docs/design/design-components.md` | Catalog of design-system components                               | Before creating a new component |

Read the TL;DR and Table of Contents of each file first, then dive into the sections relevant to your task.

## 2. Project Identification

- **Project name**: Personal website
- **Description**: A personal portfolio and blog site built with Nuxt. Introduces the developer and showcases their writings.
- **Repository URL**: https://github.com/amirhossein-fzl/personal-website
- **Primary Contact / Team**: [Amirhossein Fazli](https://github.com/amirhossein-fzl)
- **License**: GPL v3
- **Date of creation**: 2026-10-11

## 3. Project Overview (Short)

- **Frontend**: Nuxt (this repo).
- **Blog backend**: Separate project (outside this repo). No backend logic here.
- **Language**: Multi-language (i18n) — English and Persian. LTR/RTL.

For full technical detail, see `ARCHITECTURE.md`.

## 4. Golden Rules

### 4.1 Before making changes
- Read the relevant documentation (see §1).
- Understand where the change fits into the architecture.
- If in doubt, **ask**. Don't guess.
- Look for existing patterns in the code and follow them. **Consistency > Cleverness.**

### 4.2 During the change
- Keep changes small and focused. One PR = one goal.
- Use TypeScript. **No `any`. No `@ts-ignore`.**
- Maintain the default Nuxt structure.
- Reuse existing components instead of building from scratch.
- Follow the coding standards in `ARCHITECTURE.md` §12.

### 4.3 After the change
- Go through the checklist in §8.
- - Ensure the commit itself is atomic and flawless (see §10).
- If the behavior has changed, update the relevant documentation accordingly.
- Write a standard commit message (§7).

## 5. Hard No / Never

| #   | Prohibited                                                                                 | Reason                                    |
| --- | ------------------------------------------------------------------------------------------ | ----------------------------------------- |
| 1   | Implementing backend logic in this repo                                                    | The backend is a separate project.        |
| 2   | Installing new dependencies without justification                                          | Keep the project lightweight.             |
| 3   | Restructuring project folders without a valid reason                                       | Consistency.                              |
| 4   | Using `any` or `@ts-ignore` in TypeScript                                                  | Type safety.                              |
| 5   | Modifying design docs (`docs/design/*`) without coordination                               | They are the source of truth.             |
| 6   | Creating a new component when a similar one exists                                         | No duplication.                           |
| 7   | Committing `.env` files, keys, or tokens                                                   | Security.                                 |
| 8   | Modifying files in `.nuxt/`                                                                | Auto-generated.                           |
| 9   | Modifying `runtimeConfig`, `modules`, or `routeRules` in `nuxt.config.ts` without flagging | Config changes have wide blast radius.    |
| 10  | Inventing API endpoints, locale keys, or component names                                   | Verify or ask.                            |
| 11  | Pushing unless explicitly asked                                                            | The user controls the git history.        |
| 12  | Creating a commit that leaves the codebase in a broken state                               | Every commit must be revertible. See §10. |

## 6. Working on the UI

1. Read `docs/design/DESIGN.md`. Understand why the project was designed this way.
2. Search the code — make sure a similar component doesn't already exist.
3. If a new component is required:
   - First, ask why the existing component cannot be used.
   - If approved, create it in `app/components/ui/`, then:
     - Add it to `docs/design/design-components.md`.
     - Update `docs/design/design-showcase.html`.
   - Use **design tokens** instead of hardcoded values (see `design-guidelines.md`).

**Important**: If `design-components.md` conflicts with the current code, treat it as a bug and notify the developer. Do not decide on your own which one is correct.

## 7. Commit & PR Rules

- **PR title**: `[<type>] <description>`.
- **Before committing**: always run `pnpm lint`.
- **Before declaring done**: run `pnpm test` (it includes Playwright).

### 7.1 Commit message format (Conventional Commits)

```
<type>: <description>
```

Types:
- **feat**: A new feature for the user (not a build script change).
- **fix**: A bug fix for the user (not a build script fix).
- **docs**: Documentation changes.
- **style**: Formatting, missing semicolons, etc.
- **refactor**: Refactoring production code.
- **test**: Adding or refactoring tests; no production code change.
- **perf**: Performance improvements.
- **build**: Build config, dev tools, or other changes irrelevant to the user.

### 7.2 PR checklist
- [ ] Changes are compatible with the project structure.
- [ ] TypeScript check passes.
- [ ] Linting passes (`pnpm lint`).
- [ ] Existing components have been reused where possible.
- [ ] Relevant documentation has been updated (if necessary).
- [ ] Section 8 checklist completed.
- [ ] Each commit in the PR is atomic and flawless (see §10).

## 8. Final Pre-Delivery Checklist

Before declaring the task complete, ensure:

- [ ] Followed `ARCHITECTURE.md`.
- [ ] For UI tasks, adhered to `docs/design/DESIGN.md`.
- [ ] Backend calls use `$api` or `useApi` (never raw URLs).
- [ ] No duplicate components were created.
- [ ] `pnpm test` is green (including Playwright).
- [ ] TypeScript and lint checks pass.
- [ ] Relevant documentation updated.
- [ ] Commit message follows the standard (§7.1).
- [ ] Every commit is atomic and flawless (§10).

## 9. When You Get Stuck

| Problem                                                           | Where to look                                            |
| ----------------------------------------------------------------- | -------------------------------------------------------- |
| Don't know where to put the code                                  | `ARCHITECTURE.md` §3                                     |
| Don't know which color / font / spacing to use                    | `docs/design/design-guidelines.md`                       |
| Don't know whether to create a component or reuse an existing one | `docs/design/design-components.md`                       |
| Don't know how to call the backend                                | `ARCHITECTURE.md` §6                                     |
| Don't know how to add a translation                               | `ARCHITECTURE.md` §7                                     |
| Don't know how to split a change into commits                     | §10 below                                                |
| Conflict between documentation and code                           | Ask — do not decide on your own                          |
| User request conflicts with the rules                             | Explain the situation and get approval before proceeding |

## 10. Commit Granularity & Atomicity

### 10.1 Keep changes small
- Prefer **small, focused changes** over large sweeping ones. A reviewer should be able to understand a diff in a single sitting.
- One commit should represent **one logical change**. If you find yourself writing "and" in the commit description, it is probably two commits.
- Do not mix unrelated concerns in a single commit — e.g. a bug fix and a refactor, or a feature and its documentation rewrite, belong in separate commits even if they touch the same files.

### 10.2 Every commit must be flawless
A commit is **flawless** when the following holds:

> **If this commit were reverted — in isolation, without touching any other commit — the codebase would still build, type-check, lint, and pass all tests without errors.**

In practice, this means each commit must be **self-contained and revertible**. It must not rely on changes that arrive in a later commit, and it must not leave the codebase in an intermediate broken state.

### 10.3 Rules that follow from this
- **No "WIP" or "fix typo from previous commit" commits.** Squash them before the branch is shared.
- **No commit that only renames a symbol in one place** while the rest of the code still uses the old name — that's a broken intermediate state. Do the rename everywhere in the same commit.
- **No commit that adds a component without adding its usages** if the removal of the component in isolation would leave an unused import or an unresolved reference elsewhere.
- **No commit that introduces a type error, a lint error, or a failing test**, even momentarily. Each commit must pass on its own.
- **No commit that depends on a change in a later commit** to compile or run. If `commit A` requires `commit B` to work, they must be merged (squashed or reordered).
- **Documentation and code that describe the same change** belong together when the docs would be wrong without the code, and separate when they are genuinely independent.

### 10.4 Practical checklist before creating each commit
- [ ] The commit has a single, describable purpose.
- [ ] `pnpm lint` passes at this commit.
- [ ] Type check passes at this commit.
- [ ] `pnpm test` passes at this commit (including Playwright).
- [ ] Reverting this commit alone would leave the repo in a working state.
- [ ] The commit message follows the format in §7.1 and accurately describes the change.

If any box is unchecked, **do not commit**. Fix the change, split it, or squash it first.
