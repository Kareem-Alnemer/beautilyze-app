---
name: expo-ui
description: Use when building UI screens, components, or layouts for BeautiLyze. Enforces Expo/React Native styling, accessibility, and structure.
---

## When to Use
Trigger: You are writing a new screen, a reusable component, or modifying UI layout.

## Styling Rules
- Colors come from `src/theme/colors.ts` only. Never inline hex values.
- Spacing scale: 4, 8, 12, 16, 24, 32 (use StyleSheet.create)
- Use `StyleSheet.create()` for styles. No inline objects.
- Use Expo Router for navigation (`src/app/` directory convention).

## Screen Structure
Every screen follows this pattern:
- `src/app/<route>.tsx` — the screen component
- Hooks in `src/hooks/` — state and business logic
- No business logic inside screen components

## Accessibility (REQUIRED)
- Every `<Image>` has `accessibilityLabel`
- Every interactive element has `accessibilityRole` and `accessibilityLabel`
- Touch targets ≥ 44pt (iOS) / 48dp (Android)

## Naming Convention
- Screens: `profile.tsx`, `scan.tsx`, `report.tsx`
- Components: `IngredientCard.tsx`, `SafetyScoreBadge.tsx`
- Hooks: `useProfile.ts`, `useScan.ts`

## Verification Checklist
- [ ] No hardcoded colors — all from `src/theme/colors.ts`
- [ ] Styles use `StyleSheet.create()` outside components
- [ ] All images have `accessibilityLabel`
- [ ] Touch targets ≥ 44pt
- [ ] Business logic is in hooks, not screens
- [ ] Uses Expo Router file-based routing