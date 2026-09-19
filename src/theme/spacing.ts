export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radii = {
  input: 8,
  card: 12,
  modal: 16,
  pill: 100,
} as const;

export type Spacing = keyof typeof spacing;