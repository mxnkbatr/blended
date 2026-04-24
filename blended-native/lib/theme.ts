export type AppScheme = 'light' | 'dark';

export type AppColors = {
  bg: string;
  fg: string;
  muted: string;
  muted2: string;
  divider: string;
  card: string;
  cardBorder: string;
  cardShadow: string;
  surface: string;
  surfaceBorder: string;
  inputBg: string;
  inputBorder: string;
  danger: string;
  toastBg: string;
  toastBorder: string;
  primaryBg: string;
  primaryFg: string;
  primaryShadow: string;
};

export function getAppColors(scheme: AppScheme): AppColors {
  if (scheme === 'dark') {
    return {
      bg: '#000000',
      fg: '#ffffff',
      muted: '#a1a1aa',
      muted2: '#71717a',
      divider: 'rgba(255,255,255,0.10)',
      card: 'rgba(255,255,255,0.02)',
      cardBorder: 'rgba(255,255,255,0.10)',
      cardShadow: 'rgba(0,0,0,0.55)',
      surface: '#18181b',
      surfaceBorder: '#27272a',
      inputBg: 'rgba(0,0,0,0.20)',
      inputBorder: 'rgba(255,255,255,0.10)',
      danger: 'rgba(251,113,133,0.95)',
      toastBg: 'rgba(255,255,255,0.08)',
      toastBorder: 'rgba(255,255,255,0.14)',
      primaryBg: '#ffffff',
      primaryFg: '#09090b',
      primaryShadow: 'rgba(255,255,255,0.14)',
    };
  }

  return {
    bg: '#ffffff',
    fg: '#09090b',
    muted: '#52525b',
    muted2: '#71717a',
    divider: 'rgba(0,0,0,0.10)',
    card: 'rgba(0,0,0,0.02)',
    cardBorder: 'rgba(0,0,0,0.10)',
    cardShadow: 'rgba(9,9,11,0.08)',
    surface: '#f4f4f5',
    surfaceBorder: 'rgba(0,0,0,0.10)',
    inputBg: 'rgba(0,0,0,0.04)',
    inputBorder: 'rgba(0,0,0,0.10)',
    danger: 'rgba(225,29,72,0.92)',
    toastBg: 'rgba(0,0,0,0.06)',
    toastBorder: 'rgba(0,0,0,0.10)',
    primaryBg: '#09090b',
    primaryFg: '#ffffff',
    primaryShadow: 'rgba(9,9,11,0.14)',
  };
}

