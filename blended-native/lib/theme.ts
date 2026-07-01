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

const ACHIRA = {
  blue: '#1e4f96',
  blueDark: '#153a70',
  cream: '#f4efe6',
  paper: '#ebe4d8',
  burgundy: '#7c1f32',
  ink: '#1a2f4d',
  navy: '#0f1a2e',
};

export function getAppColors(scheme: AppScheme): AppColors {
  if (scheme === 'dark') {
    return {
      bg: ACHIRA.navy,
      fg: ACHIRA.cream,
      muted: 'rgba(244,239,230,0.65)',
      muted2: 'rgba(244,239,230,0.45)',
      divider: 'rgba(244,239,230,0.10)',
      card: 'rgba(244,239,230,0.03)',
      cardBorder: 'rgba(244,239,230,0.10)',
      cardShadow: 'rgba(0,0,0,0.55)',
      surface: '#162238',
      surfaceBorder: 'rgba(244,239,230,0.12)',
      inputBg: 'rgba(0,0,0,0.20)',
      inputBorder: 'rgba(244,239,230,0.10)',
      danger: 'rgba(251,113,133,0.95)',
      toastBg: 'rgba(244,239,230,0.08)',
      toastBorder: 'rgba(244,239,230,0.14)',
      primaryBg: ACHIRA.cream,
      primaryFg: ACHIRA.blueDark,
      primaryShadow: 'rgba(244,239,230,0.14)',
    };
  }

  return {
    bg: ACHIRA.cream,
    fg: ACHIRA.ink,
    muted: 'rgba(26,47,77,0.65)',
    muted2: 'rgba(26,47,77,0.45)',
    divider: 'rgba(30,79,150,0.10)',
    card: 'rgba(30,79,150,0.03)',
    cardBorder: 'rgba(30,79,150,0.10)',
    cardShadow: 'rgba(30,79,150,0.08)',
    surface: ACHIRA.paper,
    surfaceBorder: 'rgba(30,79,150,0.10)',
    inputBg: 'rgba(30,79,150,0.04)',
    inputBorder: 'rgba(30,79,150,0.10)',
    danger: ACHIRA.burgundy,
    toastBg: 'rgba(30,79,150,0.06)',
    toastBorder: 'rgba(30,79,150,0.10)',
    primaryBg: ACHIRA.blue,
    primaryFg: ACHIRA.cream,
    primaryShadow: 'rgba(30,79,150,0.20)',
  };
}
