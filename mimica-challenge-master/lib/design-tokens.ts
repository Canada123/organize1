// Design System v5 Tokens - Mimica Analytics Platform

export const colors = {
  primary: {
    blue: '#1E88E5',
    blueLight: '#E3F2FD',
    blueDark: '#1565C0',
  },
  secondary: {
    green: '#4CAF50',
    greenLight: '#E8F5E9',
    greenDark: '#388E3C',
  },
  warning: {
    orange: '#FB8C00',
    orangeLight: '#FFF3E0',
    orangeDark: '#E65100',
  },
  info: {
    purple: '#8E24AA',
    purpleLight: '#F3E5F5',
    purpleDark: '#6A1B9A',
  },
  neutral: {
    light: '#F5F5F5',
    dark: '#212121',
    grey: '#757575',
    greyLight: '#E0E0E0',
    greyDark: '#424242',
    white: '#FFFFFF',
  },
  // Pastel colors for charts
  pastel: {
    blue: '#87CEEB',
    green: '#98D8C8',
    purple: '#B19CD9',
    orange: '#FFB347',
    pink: '#FF9FB5',
  },
} as const;

export const typography = {
  fontFamily: {
    sans: ['Inter', 'IBM Plex Sans', 'system-ui', 'sans-serif'],
    mono: ['IBM Plex Mono', 'Consolas', 'monospace'],
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
} as const;

export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
} as const;

export const borderRadius = {
  none: '0px',
  sm: '2px',
  base: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Badge variants
export const badgeVariants = {
  ease: {
    Low: { bg: colors.neutral.greyLight, text: colors.neutral.greyDark },
    Medium: { bg: colors.warning.orangeLight, text: colors.warning.orangeDark },
    High: { bg: colors.secondary.greenLight, text: colors.secondary.greenDark },
  },
  automatability: {
    Low: { bg: colors.neutral.greyLight, text: colors.neutral.greyDark },
    Medium: { bg: colors.warning.orangeLight, text: colors.warning.orangeDark },
    High: { bg: colors.secondary.greenLight, text: colors.secondary.greenDark },
    'Very High': { bg: colors.secondary.green, text: colors.neutral.white },
  },
} as const;

// Chart colors
export const chartColors = {
  applications: [
    colors.pastel.blue,
    colors.pastel.green,
    colors.pastel.purple,
    colors.pastel.orange,
    colors.neutral.greyLight,
  ],
  regions: {
    Americas: colors.pastel.blue,
    EMEA: colors.pastel.purple,
    APAC: colors.pastel.green,
    LATAM: colors.pastel.orange,
    'North America': colors.pastel.pink,
  },
  variants: {
    A: colors.pastel.blue,
    B: colors.pastel.green,
    C: colors.pastel.purple,
    D: colors.pastel.orange,
    E: colors.pastel.pink,
  },
} as const;