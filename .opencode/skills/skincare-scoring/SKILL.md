---
name: skincare-scoring
description: Implements BeautiLyze's two-stage mathematical safety and suitability penalty logic. Load when writing scoring, recommendation, or report logic.
---

# Skincare Scoring Rules

## Intrinsic Safety Score (S_safe)
Base score: 100
For each ingredient i:
  hazard_weight_i = retrieve from ingredients table (1 to 5)
  S_safe = 100 - SUM(hazard_weight_i * 4)
Clamp to [0, 100]

## Personalized Suitability Score (S_suit)
S_suit = max(0, S_safe - SUM(P_k))

Penalty values:
- Critical (P_k = 50): User allergy match OR explicit medical restriction
- High Conflict (P_k = 30): Irritant/Fragrance + sensitive skin profile
- Moderate Conflict (P_k = 20): Comedogenic + oily skin profile

## Threshold Classification (0–100 scale ONLY)
- S_suit >= 80: "Safe — Ideal for your profile" (Green)
- 50 <= S_suit < 80: "Potential Warning" (Yellow)
- S_suit < 50: "Not Recommended for Your Profile" (Red)

NEVER use 4.0/2.5 scale. NEVER use 1–5 scale for final output.