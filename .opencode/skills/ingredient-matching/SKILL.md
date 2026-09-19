---
name: ingredient-matching
description: Fuzzy string matching for OCR-extracted ingredients against the INCI database. Load when writing OCR or ingredient lookup code.
---

# Ingredient Matching Pipeline

## Step 1: On-Device OCR
Use Google ML Kit Text Recognition (free, on-device).
Preprocess: grayscale → contrast enhancement → crop label region.

## Step 2: Fuzzy Matching (ONLY method)
Use PostgreSQL pg_trgm trigram similarity.
Query:
  SELECT inci_name, similarity(inci_name, $1) AS sim
  FROM ingredients
  WHERE inci_name % $1
  ORDER BY sim DESC
  LIMIT 1;

Accept match if sim >= 0.7.
If sim < 0.7: assign hazard_weight = 3, badge as "Unclassified".
NEVER call an external LLM. NEVER send user data off-device.