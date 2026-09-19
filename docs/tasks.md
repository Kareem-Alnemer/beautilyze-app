# BeautiLyze — Milestone Tracker

## Status Legend
- ⬜ Not started
- 🟡 In progress
- ✅ Complete (validated)

## Milestones

### M1 — Project Foundation ⬜
**Goal:** App runs in Expo Go, Supabase connected, auth flow works.
**Acceptance:** User can sign up, log in, and see an empty profile screen.

#### M1.1 — Install Supabase JS client ⬜
- File: `package.json` (via `npx expo install @supabase/supabase-js`)
- Skill: none
- Acceptance: `@supabase/supabase-js` appears in `package.json` dependencies and `npm ls` shows no peer conflicts.
- Depends on: none

#### M1.2 — Create Supabase client singleton ⬜
- File: `src/lib/supabase.ts`
- Skill: none
- Acceptance: Exports a configured `supabase` client reading `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from env; `tsc --noEmit` passes.
- Depends on: M1.1

#### M1.3 — Add Supabase env vars to `.env.local` ⬜
- File: `.env.local`
- Skill: none
- Acceptance: `.env.local` contains `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` placeholders (real values filled by user); file is in `.gitignore`.
- Depends on: none

#### M1.4 — Create Supabase DB migration (skin_profiles + analysis_reports + ingredients + RLS) ⬜
- File: `src/supabase/migrations/001_initial_schema.sql`
- Skill: none
- Acceptance: Migration creates `skin_profiles` (id uuid pk, user_id uuid references auth.users, skin_type text, concerns text[], allergies text[], age_group text, sensitivity_level text, updated_at timestamptz), `analysis_reports` (id uuid pk, user_id uuid references auth.users, product_name text nullable, scanned_at timestamptz, ingredients_json jsonb, s_safe int, s_suit int, classification text, penalties_json jsonb, unclassified_count int), and `ingredients` (id uuid pk, inci_name text unique, common_name text, function text, hazard_weight int check 1-5, category text, explanation text, source_ref text); enables `pg_trgm` extension; creates `idx_inci_trgm` GIN index on ingredients.inci_name using gin_trgm_ops; applies `auth.uid() = user_id` RLS policies on skin_profiles and analysis_reports; applies public read + admin write only policy on ingredients; SQL is valid Postgres.
- Depends on: none

#### M1.5 — Create TypeScript types for Supabase tables ⬜
- File: `src/types/supabase.ts`
- Skill: none
- Acceptance: Exports `SkinProfile`, `AnalysisReport`, `Ingredient` interfaces matching the migration schema; `tsc --noEmit` passes.
- Depends on: M1.4

#### M1.6 — Create AuthContext provider ⬜
- File: `src/contexts/auth-context.tsx`
- Skill: none
- Acceptance: Exports `AuthProvider` and `useAuth` hook; wraps `supabase.auth.onAuthStateChange`; exposes `user`, `session`, `loading`, `signUp` (calls `supabase.auth.signUp({email, password})`), `signIn` (calls `supabase.auth.signInWithPassword({email, password})`), `signOut` (calls `supabase.auth.signOut()`); no profile creation logic; `tsc --noEmit` passes.
- Depends on: M1.2, M1.5

#### M1.7 — Create Sign-Up screen ⬜
- File: `src/app/(auth)/sign-up.tsx`
- Skill: `expo-ui`
- Acceptance: Renders email + password form; calls `signUp` from AuthContext; shows validation errors; navigates to login on success; uses `StyleSheet.create()` and theme tokens only.
- Depends on: M1.6

#### M1.8 — Create Login screen ⬜
- File: `src/app/(auth)/login.tsx`
- Skill: `expo-ui`
- Acceptance: Renders email + password form; calls `signIn` from AuthContext; shows validation errors; navigates to home on success; uses `StyleSheet.create()` and theme tokens only.
- Depends on: M1.6

#### M1.9 — Create empty Profile screen ⬜
- File: `src/app/(authenticated)/profile.tsx`
- Skill: `expo-ui`
- Acceptance: Renders a placeholder profile screen showing the logged-in user's email; uses `StyleSheet.create()` and theme tokens only; `tsc --noEmit` passes.
- Depends on: M1.6

#### M1.10 — Rewrite root layout with auth gate and routing groups ⬜
- File: `src/app/_layout.tsx`
- Skill: `expo-ui`
- Acceptance: Root layout wraps app in `AuthProvider`; defines `(auth)` and `(authenticated)` route groups; redirects unauthenticated users to login; authenticated users to home; existing tab navigation preserved for authenticated state.
- Depends on: M1.6, M1.7, M1.8, M1.9

#### M1.11 — Replace home screen with post-login home ⬜
- File: `src/app/(authenticated)/index.tsx`
- Skill: `expo-ui`
- Acceptance: Home screen shows a welcome message, "Scan Product" button (placeholder), and link to profile; uses `StyleSheet.create()` and theme tokens only; the default Expo template content is removed.
- Depends on: M1.10

#### M1.12 — Run lint and typecheck validation ⬜
- File: none (verification step)
- Skill: none
- Acceptance: `npx tsc --noEmit` returns zero errors; `npm run lint` returns zero errors; app launches in Expo Go without console errors. If any check fails, report the error and stop — do not attempt fixes, do not mark complete.
- Depends on: M1.1–M1.11

### M2 — Skin Profile ⬜
**Goal:** User can complete a skin profile (type, concerns, allergies, age group).
**Acceptance:** Profile saves to Supabase, reloads correctly on next login.

### M2 — Skin Profile ⬜

**Goal:** User completes a mandatory skin profile before accessing the app.
**Acceptance:** After sign-up, user is redirected to the questionnaire. Cannot proceed until all 5 fields are filled. Profile saves to Supabase. Reloads correctly on next login.

#### M2.1 — Create `useSkinProfile` hook
- File: `src/hooks/use-skin-profile.ts`
- Skill: none
- Acceptance: Exports `useSkinProfile()` returning `{ profile, loading, error, saveProfile, refreshProfile }`. Reads from `skin_profiles` table filtered by `auth.uid()`. Writes via upsert. Handles missing-row case (returns `null` for profile). `tsc --noEmit` passes.
- Depends on: M1 complete

#### M2.2 — Create Skin Profile questionnaire screen
- File: `src/app/(authenticated)/profile-setup.tsx`
- Skill: `expo-ui`
- Acceptance: Renders 5 fields: skin_type (single-select), concerns (multi-select chips), allergies (free text + chips), age_group (single-select), sensitivity_level (single-select). Submit button calls `saveProfile()`. On success navigates to home. Uses `StyleSheet.create()` and theme tokens only. All inputs have `accessibilityLabel`. `tsc --noEmit` passes.
- Depends on: M2.1

#### M2.3 — Add profile-completion gate to root layout
- File: `src/app/_layout.tsx`
- Skill: none
- Acceptance: After auth resolves, checks if user has a skin profile. If authenticated AND no profile AND not already on `profile-setup`, redirect to `profile-setup`. If authenticated AND has profile AND on `profile-setup`, redirect to home. No redirect loops. `tsc --noEmit` passes.
- Depends on: M2.1, M2.2

#### M2.4 — Update Profile screen to show real profile data
- File: `src/app/(authenticated)/profile.tsx`
- Skill: `expo-ui`
- Acceptance: Shows user email, skin type, concerns, allergies, age group, sensitivity level. "Edit Profile" button navigates to `profile-setup`. Sign Out button unchanged. Uses `StyleSheet.create()` and theme tokens only. `tsc --noEmit` passes.
- Depends on: M2.1

#### M2.5 — Final validation
- File: none (verification step)
- Skill: none
- Acceptance: `npx tsc --noEmit` returns zero errors. `npm run lint` returns zero errors. Manual test: new user signs up → redirected to profile-setup → fills form → redirected to home → profile tab shows saved data. If any check fails, report error and stop — do not attempt fixes, do not mark complete.
- Depends on: M2.1–M2.4

### M3 — Ingredient Scanning ⬜
**Goal:** User can scan a product label and see parsed ingredients.
**Acceptance:** OCR extracts text, pg_trgm matches ingredients, unmatched are flagged.

### M4 — Scoring & Report ⬜
**Goal:** User sees S_safe, S_suit, and a detailed report.
**Acceptance:** Report shows score ring, ingredient breakdown, and explanations.

### M5 — Routine Management ⬜
**Goal:** User can save products into AM/PM routines.
**Acceptance:** Routine persists, reloads, and flags known conflicts.

### M6 — Report Export & History ⬜
**Goal:** Reports are saved and exportable as PDF.
**Acceptance:** History list loads past reports; PDF downloads on device.

### M7 — Polish & Demo ⬜
**Goal:** Accessibility pass, dark mode, seed data, demo rehearsal.
**Acceptance:** All screens pass WCAG AA checks; dark mode works everywhere.
