---

# BeautiLyze — Agent Operating Rules

Append-only section. Expo's auto-generated content above stays intact.
Instruction order: task requirements → this section → skills → repo conventions → idioms.

## Project Identity

BeautiLyze is a skincare analysis Android app built with Expo SDK 54+ (React Native + TypeScript).
Users scan product ingredient labels, and the app scores them against their skin profile.
Web-first was considered and rejected: this is a mobile-native app.

## Locked Stack (do not change without explicit user approval)

| Layer | Choice |
|---|---|
| Mobile | Expo SDK 54+, React Native, TypeScript (strict) |
| Navigation | Expo Router (file-based, `src/app/`) |
| Styling | `StyleSheet.create()` + `src/theme/` tokens |
| State | React hooks + Context. No Redux, no Zustand. |
| Backend | Supabase (Postgres, Auth, Storage, Edge Functions) |
| OCR | Google ML Kit Text Recognition (on-device, free) |
| Ingredient match | PostgreSQL `pg_trgm` trigram similarity |
| PDF export | `expo-print` |
| Testing | Jest + React Native Testing Library |

## Critical Safety Rules (non-negotiable)

1. No cloud LLM calls from the app.
2. No raw facial image storage. Process in memory, discard.
3. No `oc/*` models through any gateway. OpenCode Zen's free tier is client-gated.
4. No secrets in code. API keys live in `.env.local` (gitignored).
5. No destructive commands. `rm -rf`, `git push`, `git reset --hard` are denied.
6. No medical claims. Use "recommended for your profile" not "safe"/"dangerous".
7. No hardcoded colors. All colors from `src/theme/colors.ts`.
8. No inline styles. All styles use `StyleSheet.create()` outside the component body.

## Working Sequence (per task)

1. Read — `AGENTS.md`, the relevant `SKILL.md`, and the current file(s).
2. Audit — inspect working tree, existing types, existing patterns. No guessing.
3. Plan — state the smallest complete change that solves the task.
4. Build — one complete file or one complete function per delivery.
5. Verify — run `npm run lint` and `npx tsc --noEmit`. No claim of success without output.
6. Report — what changed, where, what was validated, what remains unverified.

If a task is ambiguous, stop and ask. Do not invent scope.

## Code Delivery Rules

- Fenced code blocks with a path header comment on the first line.
- Complete files only. No partial functions, no `// TODO`, no `...` ellipses.
- When editing an existing file, show the exact before/after block.
- No test files, mocks, or demo scaffolding unless explicitly requested.
- No speculative compatibility layers. No commented-out alternatives.
- Preserve unrelated user changes. Inspect `git diff` before editing.

## Architecture Rules

- Screens in `src/app/`, components in `src/components/`, hooks in `src/hooks/`.
- Business logic in hooks, never in screens.
- Pure functions in `src/lib/`. Types in `src/types/`.
- Reuse existing components before creating new ones.
- Small files over large files. Split at ~200 lines.
- No cross-imports between sibling screens. Shared logic goes to `src/lib/` or `src/hooks/`.

## Skill Loading

| Task | Skill |
|---|---|
| Scoring, penalties, S_safe, S_suit | `skincare-scoring` |
| OCR, ingredient lookup, fuzzy match | `ingredient-matching` |
| Any UI, screen, component, styling | `expo-ui` |

Skills are authoritative. If a skill and a habit conflict, the skill wins.

## Database Safety (Supabase)

- Migrations in `src/supabase/migrations/` with timestamped filenames.
- Every user-owned table must have RLS enabled with a `auth.uid() = user_id` policy.
- Enable extensions explicitly (`pg_trgm`, `uuid-ossp`) in the migration.
- Never `DROP` a column with data. Stage: add new → migrate → remove old.
- Seed data goes in `src/supabase/seed.sql`, idempotent (`ON CONFLICT DO NOTHING`).
- Never modify the DB schema from the app at runtime.

## Validation

Before claiming a task is done:
- `npx tsc --noEmit` — zero errors
- `npm run lint` — zero errors
- The changed screen renders in Expo Go without console errors
- The changed logic has at least a manual smoke test through the UI

If any of these cannot run, say so explicitly.

## Environment

- Shell: Windows PowerShell 5.1.
- Use `$env:VAR = "value"` to set env vars for the session.
- Never commit `.env.local`, `local.properties`, or any file in `.gitignore`.
- Read-only commands before modifying commands.

## Documentation

- `docs/PRD.md` — source of truth for scope. Do not edit without user approval.
- `docs/architecture.md` — locked stack decisions.
- `docs/tasks.md` — milestone tracker.
- `docs/SCRATCHPAD.md` — free-form working notes.
- Update matching doc when behavior, config, or architecture changes.

## Forbidden Behaviors

- Calling any external LLM API from the app
- Storing raw facial images anywhere
- Hardcoding colors, spacing, or secrets
- Writing business logic inside a screen component
- Generating migrations without RLS policies
- Using `any` in TypeScript without a comment explaining why
- Adding a dependency without asking first
- Marking a task complete when validation failed or did not run
- Silently suppressing errors with empty catch blocks
- Producing partial files, placeholders, or `// TODO` markers
- Reformatting unrelated files
- Reverting changes the user made manually
- Using any `eas-*` skill or EAS paid service (free tier only)

## Design System Rules

- Grid: 8px base. 4px half-step for micro spacing.
- Type scale: 9 levels. Fraunces for display/headings. Inter for body/UI.
- Radii: 8 (input) / 12 (card) / 16 (modal) / 100 (pill).
- Shadows: 3 levels, warm-tinted (`rgba(31,36,32,...)`).
- Motion: 150ms micro · 250ms standard · 400ms page · 4000ms ambient.
- Easing: `cubic-bezier(0.2, 0.8, 0.2, 1)` standard.
- Breakpoints: 480 / 768 / 1024 / 1280.
- Dark mode: Every color token has a dark variant.
- A11y: WCAG 2.1 AA. 4.5:1 body contrast. 3:1 large. 44pt touch targets. Focus-visible rings.

## Communication

- Concise. Implementation-oriented.
- Use exact file paths, symbol names, and command output.
- State what was validated and what remains unverified.
- No generic tutorials when repo-specific action is possible.
- No claims of completion beyond the evidence.

## Completion Criteria

A task is complete only when:
1. The verified blocker is addressed.
2. Implementation is internally consistent.
3. `tsc --noEmit` and `lint` both pass.
4. The changed workflow was exercised in Expo Go.
5. No known blocker is concealed.
6. Required documentation is updated.
7. Final report states: what changed · where · what was validated · remaining risks.