# BeautiLyze Architecture

## Purpose
Locked technical decisions. Do not change without user approval.

## Stack

| Layer | Choice | Rationale |
|---|---|---|
| Mobile | Expo SDK 54+ (React Native, TypeScript) | Single codebase, Expo Go for instant testing, no build step required |
| Navigation | Expo Router | File-based routing, matches Expo SDK 54+ conventions |
| Styling | StyleSheet.create + src/theme/ | No CSS-in-JS dependency, tokens are centralized |
| State | React hooks + Context | No Redux/Zustand for MVP scope |
| Backend | Supabase (Postgres, Auth, Storage, Edge Functions) | Free tier covers MVP; one service for DB + auth + storage |
| OCR | Google ML Kit Text Recognition | On-device, free, no network round-trip |
| Ingredient match | PostgreSQL pg_trgm | Fuzzy matching without ML hosting |
| PDF export | expo-print | Native, free, no external service |
| AI explanation | On-device Gemma 2B via MediaPipe (optional, Phase 2) | Satisfies "LLM feature" requirement without cloud calls |
| Testing | Jest + React Native Testing Library | Standard Expo testing stack |

## Explicit Non-Choices

| Rejected | Why |
|---|---|
| Cloud LLM APIs (Gemini, OpenAI, Anthropic) | Privacy: user data would leave the device |
| BERT / fine-tuned transformers | Computational cost, no free hosting path |
| YOLO label detection | Extra pipeline step, ML Kit handles OCR directly |
| Collaborative filtering | Cold-start problem with no user base |
| Server-side CNN inference | On-device ML Kit is faster and free |
| Native Android (Kotlin) | AI agent writes TypeScript; debugging Kotlin is a tax |
| OmniRoute / gateways | OpenCode Zen free tier is client-gated; direct connection is simpler |

## Data Model (high level)

- `users` — Supabase auth
- `skin_profiles` — skin type, concerns, allergies, age group
- `ingredients` — INCI name, hazard weight (1–5), category, explanation
- `products` — scanned products with parsed ingredient lists
- `analysis_reports` — S_safe, S_suit, penalties, timestamp
- `routines` — AM/PM product lists per user

## Privacy Guarantees

1. Raw facial images are never persisted. Processed in memory, discarded.
2. Only derived skin profile (type + concerns) is stored.
3. No third-party LLM receives user data.
4. All user-owned tables have RLS with `auth.uid() = user_id`.

## Scoring Model

See `.opencode/skills/skincare-scoring/SKILL.md`. Locked. Do not re-derive.