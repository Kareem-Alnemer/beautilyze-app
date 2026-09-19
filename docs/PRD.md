# BeautiLyze — Product Requirements Document

## Summary

BeautiLyze is an Android app that helps skincare users decide whether a product is right for them before they buy it. The user completes a one-time skin profile, then scans any serum or moisturizer label with their phone camera. The app extracts the ingredient list, matches it against a curated database of 150 common skincare ingredients, and returns a personalized report with two scores: intrinsic safety (S_safe) and personal suitability (S_suit). Every warning explains *why* it fired. No cloud LLM. No facial image storage. Free to run.

## Problem

Skincare consumers cannot read INCI ingredient labels. Existing apps either only analyze ingredients without knowing the user (INCI Beauty, INCIDecoder) or only analyze the user without analyzing ingredients (Ulta, myAster). None explain *why* a specific ingredient is wrong for a specific person. As a result, users buy products that cause irritation, waste money, and lose trust in skincare apps.

## Primary User

A skincare consumer, aged 18–35, who has bought a product that broke them out, wants a fast "should I buy this?" answer, and does not want to pay for a dermatologist.

## Jobs To Be Done

1. **Before buying:** "Is this product safe for my skin type?"
2. **After buying:** "Why is this product making my skin worse?"
3. **Over time:** "What should I avoid in every product?"

## MVP Scope (v1)

**In scope:**
- Skin profile questionnaire (first-run gate, mandatory before scan)
- Product label scan via camera
- On-device OCR via Google ML Kit
- Ingredient matching against 150 curated ingredients via PostgreSQL `pg_trgm`
- Dual scoring: S_safe (intrinsic) + S_suit (personalized)
- Personalized report with per-ingredient explanations
- Unclassified ingredient handling (grey badge + warning count)
- Scan history (last 20 reports)

**Explicitly out of scope (Phase 2):**
- On-device LLM (Gemma 2B) explanations
- Routine conflict detection
- Collaborative filtering
- PDF report export
- Arabic language / RTL
- Facial image analysis / skin type detection from photos
- Barcode scanning
- Product recommendations

## User Flow

```
First run:
  Open app → Skin profile questionnaire (5 fields) → Save to Supabase
  → Home screen

Every scan:
  Home → Tap "Scan Product" → Camera opens
  → User frames ingredient list → ML Kit extracts text
  → Supabase pg_trgm matches ingredients
  → Scoring engine computes S_safe + S_suit
  → Report screen shows:
      - Score ring (0–100)
      - Classification badge (Safe / Warning / Not Recommended)
      - Ingredient list with per-item badges
      - Explanations for each warning
      - Unclassified count (if any)
  → Save to history

History:
  Home → Tap "Reports" → List of past scans
  → Tap one → Same report view
```

## Functional Requirements

### FR1 — Skin Profile Questionnaire (First-Run Gate)

- Fields: skin type (single-select), concerns (multi-select), allergies (chips + free text), age group (single-select), sensitivity level (single-select)
- Mandatory: cannot proceed to scan without completing
- Stored in Supabase `skin_profiles` table, one row per user
- Editable from profile screen
- Must complete in under 90 seconds

### FR2 — Product Label Scan

- Camera capture with live preview
- Frame guide overlay for ingredient list
- On-device OCR via Google ML Kit Text Recognition
- No image is uploaded, stored, or transmitted
- If OCR confidence is below threshold: prompt to retake

### FR3 — Ingredient Matching

- Raw OCR text is split into tokens
- Each token is matched against `ingredients.inci_name` via `pg_trgm` similarity
- Match threshold: 0.7
- Matches below 0.7 are marked `Unclassified`
- Return matched ingredient IDs + similarity scores

### FR4 — Scoring

- **S_safe** = `100 - SUM(hazard_weight_i * 4)`, clamped [0, 100]
- **S_suit** = `max(0, S_safe - SUM(P_k))`
- Penalties: `P_k = 50` (critical allergy/restriction), `30` (high conflict), `20` (moderate conflict)
- Classification: `S_suit >= 80` → Safe, `50–79` → Warning, `< 50` → Not Recommended
- 0–100 scale only. Never 1–5, never 4.0/2.5.

### FR5 — Report Display

- Score ring (animated, 0–100)
- Classification badge with color
- Ingredient list: name, hazard weight, badge (Safe / Caution / Warning / Unclassified)
- Explanation text for each warning (rule-based, template-driven)
- Unclassified count warning at top if any exist
- "Reasons for your score" section listing each penalty applied

### FR6 — Scan History

- Last 20 scans per user
- Stored in `analysis_reports` table
- Tap a report → full report view
- Swipe to delete (with confirmation modal)

## Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Performance** | Scan-to-report in under 30 seconds on a mid-range Android device |
| **Privacy** | No facial images. No raw label images stored. Only derived data persists. |
| **Security** | Supabase RLS on all user-owned tables. `auth.uid() = user_id` policy. |
| **Offline** | OCR runs on-device. Ingredient matching requires network (Supabase). |
| **Accessibility** | WCAG 2.1 AA. 44pt touch targets. 4.5:1 body contrast. Screen reader labels. |
| **Dark mode** | Every screen. Token-based, no hardcoded colors. |
| **Localization** | English only in v1. RTL-ready structure for Phase 2. |
| **Data retention** | Reports persist until user deletes. No automatic expiration. |

## Data Model

```
users
  id, email, created_at
  (managed by Supabase Auth)

skin_profiles
  id, user_id, skin_type, concerns[], allergies[], age_group,
  sensitivity_level, updated_at

ingredients
  id, inci_name, common_name, function, hazard_weight (1-5),
  category, explanation, source_ref

analysis_reports
  id, user_id, product_name (nullable), scanned_at,
  ingredients_json, s_safe, s_suit, classification,
  penalties_json, unclassified_count
```

### Row Level Security

- `skin_profiles` — users read/write their own row only
- `analysis_reports` — users read/write their own rows only
- `ingredients` — public read, admin write only

## Ingredient Database

**Source:** Manual curation from INCIDecoder, CosIng, and AAD public references.

**Size:** 150 ingredients.

**Coverage target:** Common ingredients in serums and moisturizers (emollients, humectants, actives, preservatives, emulsifiers, fragrances, alcohol, common allergens).

**Fields per ingredient:**
- `inci_name` — official INCI name
- `common_name` — human-readable name
- `function` — humectant, emollient, active, preservative, fragrance, etc.
- `hazard_weight` — 1 (safe) to 5 (high concern)
- `category` — irritant, allergen, comedogenic, safe, unclassified
- `explanation` — one-sentence reason for the hazard weight
- `source_ref` — source identifier (e.g., "INCIDecoder:niacinamide")

**Handling misses:** If a scanned ingredient doesn't match, it appears in the report with a grey `Unclassified` badge. A warning at the top shows: "3 ingredients could not be identified. Score is based on the remaining 27."

## Success Metrics (Demo)

1. **Catches known allergens** — for a test product with fragrance + alcohol, the app flags both.
2. **Explains why** — every warning has a one-sentence reason visible in the report.

Secondary metrics (not graded):
- Scan-to-report under 30 seconds
- 85%+ ingredient match rate on real product labels
- Zero console errors in Expo Go

## Locked Stack

| Layer | Choice |
|---|---|
| Mobile | Expo SDK 54+, React Native, TypeScript (strict) |
| Navigation | Expo Router |
| Styling | `StyleSheet.create()` + `src/theme/` tokens |
| State | React hooks + Context |
| Backend | Supabase (Postgres, Auth, Storage, Edge Functions) |
| OCR | Google ML Kit Text Recognition (on-device) |
| Ingredient match | PostgreSQL `pg_trgm` |
| Icons | Inline SVG only |
| Fonts | Fraunces (display) + Inter (body) |

## Design Constraints

- Palette: Cream `#F7F3ED`, Ink `#1F2420`, Sage `#6B7B5E`, Clay `#E3A88E`
- Dark mode variants required for all tokens
- Grid: 8px base, 4px half-step
- Type scale: 9 levels
- Motion: 150ms micro · 250ms standard · 400ms page
- No hardcoded colors. All tokens in `src/theme/colors.ts`.

## Critical Safety Rules

1. No cloud LLM calls from the app.
2. No raw facial image storage. No raw label image storage. Process in memory, discard.
3. No `oc/*` models through any gateway.
4. No secrets in code. All keys in `.env.local` (gitignored).
5. No medical claims. Use "recommended for your profile" not "safe"/"dangerous".
6. No hardcoded colors. All from `src/theme/colors.ts`.
7. No inline styles. All via `StyleSheet.create()`.

## Phase 2 (Future Work)

- On-device LLM (Gemma 2B via MediaPipe) for explanation generation
- Facial image analysis for automatic skin profile (replaces questionnaire)
- Routine conflict detection (AM/PM interactions)
- PDF report export
- Arabic language support (RTL)
- Barcode scanning for known products
- Collaborative filtering for product recommendations
- Admin panel for ingredient database management

## Open Questions

1. Ingredient curation — who sources the 150 entries and validates hazard weights?
2. Test product for demo — which specific product will be scanned on demo day?
3. Supabase project name and region — to be created before M1 begins.

## Out of Scope (Confirmed)

Facial analysis, BERT matching, YOLO label detection, collaborative filtering, cloud LLMs, admin panel, medical diagnosis, product recommendations in v1.