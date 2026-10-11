import { useColorScheme } from 'react-native';

// Paleta del manual de marca (marca/marca-zavnir.md)
export const brand = {
  ink: '#0B0B0D',
  white: '#FAFAFA',
  silver: '#C3C7CE',
  steel: '#4D545E', // plata oscura: legible sobre fondo claro
  red: '#D64545',
};

const light = {
  bg: brand.white,
  card: '#FFFFFF',
  text: brand.ink,
  muted: '#6B7078',
  line: '#E3E5E8',
  accent: brand.steel,
  accentText: '#FFFFFF',
  danger: brand.red,
  chip: '#EEF0F2',
};

const dark: typeof light = {
  bg: brand.ink,
  card: '#17171A',
  text: brand.white,
  muted: '#9A9FA8',
  line: '#26272B',
  accent: brand.silver,
  accentText: brand.ink,
  danger: '#E86A6A',
  chip: '#232327',
};

export type Theme = typeof light;

export function useTheme(): Theme {
  return useColorScheme() === 'dark' ? dark : light;
}
