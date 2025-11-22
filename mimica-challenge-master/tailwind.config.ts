import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors from design system v5
        'primary-blue': '#1E88E5',
        'primary-blue-light': '#E3F2FD',
        'primary-blue-dark': '#1565C0',
        'secondary-green': '#4CAF50',
        'secondary-green-light': '#E8F5E9',
        'secondary-green-dark': '#388E3C',
        'warning-orange': '#FB8C00',
        'warning-orange-light': '#FFF3E0',
        'warning-orange-dark': '#E65100',
        'info-purple': '#8E24AA',
        'info-purple-light': '#F3E5F5',
        'info-purple-dark': '#6A1B9A',
        // Neutral colors
        'neutral-light': '#F5F5F5',
        'neutral-dark': '#212121',
        'neutral-grey': '#757575',
        'neutral-grey-light': '#E0E0E0',
        'neutral-grey-dark': '#424242',
        // Pastel colors for charts
        'pastel-blue': '#87CEEB',
        'pastel-green': '#98D8C8',
        'pastel-purple': '#B19CD9',
        'pastel-orange': '#FFB347',
        'pastel-pink': '#FF9FB5',
        // Text and background aliases
        'text-primary': '#212121',
        'text-secondary': '#757575',
        'bg-primary': '#FFFFFF',
        'bg-secondary': '#F5F5F5',
        'border-primary': '#E0E0E0',
      },
      fontFamily: {
        sans: ['Inter', 'IBM Plex Sans', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'Consolas', 'monospace'],
      },
      fontSize: {
        '2xs': '12px',
        '3xl': '30px',
        '4xl': '36px',
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
      },
      borderRadius: {
        'sm': '2px',
        'DEFAULT': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}

export default config