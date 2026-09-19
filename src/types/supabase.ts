// TypeScript types matching the Supabase migration schema.
// Generated for: src/supabase/migrations/001_initial_schema.sql

export interface SkinProfile {
  id: string;
  user_id: string;
  skin_type: SkinType;
  concerns: SkinConcern[];
  allergies: string[];
  age_group: AgeGroup;
  sensitivity_level: SensitivityLevel;
  updated_at: string;
}

export type SkinType = "oily" | "dry" | "combination" | "normal" | "sensitive";

export type SkinConcern =
  | "acne"
  | "aging"
  | "hyperpigmentation"
  | "redness"
  | "dehydration"
  | "texture";

export type AgeGroup = "18-24" | "25-34" | "35-44" | "45+";

export type SensitivityLevel = "low" | "medium" | "high";

export interface Ingredient {
  id: string;
  inci_name: string;
  common_name: string;
  function: string;
  hazard_weight: number; // 1 (safe) to 5 (high concern)
  category: IngredientCategory;
  explanation: string;
  source_ref: string;
}

export type IngredientCategory =
  | "irritant"
  | "allergen"
  | "comedogenic"
  | "safe"
  | "unclassified";

export interface MatchedIngredient {
  ingredient_id: string;
  inci_name: string;
  common_name: string;
  similarity: number;
  hazard_weight: number;
  category: IngredientCategory;
  explanation: string;
}

export interface AppliedPenalty {
  type: "critical" | "high" | "moderate";
  value: number; // 50, 30, or 20
  reason: string;
  ingredient_name?: string;
}

export interface AnalysisReport {
  id: string;
  user_id: string;
  product_name: string | null;
  scanned_at: string;
  ingredients_json: MatchedIngredient[];
  s_safe: number; // 0–100
  s_suit: number; // 0–100
  classification: ReportClassification;
  penalties_json: AppliedPenalty[];
  unclassified_count: number;
}

export type ReportClassification =
  | "Safe"
  | "Warning"
  | "Not Recommended";
