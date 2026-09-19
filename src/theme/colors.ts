export const colors = {
  primary: '#6B7B5E',
  primaryDeep: '#4F5C46',
  background: '#F7F3ED',
  surface: '#FFFFFF',
  text: '#1F2420',
  textMuted: '#6B655E',
  border: '#E2D9CE',
  accent: '#E3A88E',
  danger: '#B3413A',
  warning: '#C99A3E',
  success: '#5C8A5C',
  info: '#7A8DA3',
  unclassified: '#95A5A6',
} as const;

export const darkColors = {
  primary: '#8A9B7A',
  primaryDeep: '#6B7B5E',
  background: '#171A16',
  surface: '#1F241F',
  text: '#F2EDE4',
  textMuted: '#A8A29A',
  border: '#333A33',
  accent: '#E3A88E',
  danger: '#D96A63',
  warning: '#D9B35C',
  success: '#7AAB7A',
  info: '#9AACBF',
  unclassified: '#7A7F7A',
} as const;

export type ColorName = keyof typeof colors;
export type ThemeColors = typeof colors;