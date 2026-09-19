export const typography = {
  display: { fontSize: 40, fontWeight: '600' as const, lineHeight: 48 },
  h1: { fontSize: 32, fontWeight: '600' as const, lineHeight: 40 },
  h2: { fontSize: 24, fontWeight: '600' as const, lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  micro: { fontSize: 10, fontWeight: '500' as const, lineHeight: 14 },
} as const;

export type Typography = keyof typeof typography;