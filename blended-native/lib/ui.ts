import { Platform } from 'react-native';

export const FONT_DISPLAY = Platform.select({ ios: 'Georgia', android: 'serif' });

export const RADIUS = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  hero: 26,
} as const;

export const SHADOW = {
  card: Platform.select({
    ios: {
      shadowOpacity: 1,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 14 },
    },
    android: {
      elevation: 6,
    },
    default: {},
  }),
  floating: Platform.select({
    ios: {
      shadowOpacity: 1,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: 12 },
    },
    android: {
      elevation: 10,
    },
    default: {},
  }),
} as const;

export const HIT_SLOP_10 = { top: 10, bottom: 10, left: 10, right: 10 } as const;
export const HIT_SLOP_12 = { top: 12, bottom: 12, left: 12, right: 12 } as const;

