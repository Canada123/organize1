
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'sm': '640px',
				'md': '768px',
				'lg': '1024px',
				'xl': '1280px',
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['IBM Plex Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
				display: ['IBM Plex Sans', 'Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
				mono: ['IBM Plex Mono', 'Courier New', 'monospace'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					navy: 'hsl(var(--primary-navy))',
					charcoal: 'hsl(var(--primary-charcoal))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				medical: {
					teal: 'hsl(var(--medical-teal))',
					grade: 'hsl(var(--medical-grade))'
				},
				bridge: {
					teal: 'hsl(var(--bridge-teal))'
				},
				trust: {
					blue: 'hsl(var(--trust-blue))'
				},
				swiss: {
					red: 'hsl(var(--swiss-red))',
					silver: 'hsl(var(--swiss-silver))'
				},
				precision: {
					gray: 'hsl(var(--precision-gray))'
				},
				action: {
					red: 'hsl(var(--action-red))'
				},
				success: {
					green: 'hsl(var(--success-green))'
				},
				certification: {
					gold: 'hsl(var(--certification-gold))'
				},
				// Landing Page Design 2025 Colors
				lp: {
					'primary-blue': 'hsl(var(--lp-primary-blue))',
					'dark-blue': 'hsl(var(--lp-dark-blue))',
					'charcoal': 'hsl(var(--lp-charcoal))',
					'black': 'hsl(var(--lp-black))',
					'purple': 'hsl(var(--lp-purple))',
					'purple-light': 'hsl(var(--lp-purple-light))',
					'white': 'hsl(var(--lp-white))',
					'cream': 'hsl(var(--lp-cream))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			spacing: {
				'18': '4.5rem',
				'22': '5.5rem',
				'30': '7.5rem',
				'34': '8.5rem',
				'38': '9.5rem'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'scale-in': {
					'0%': { transform: 'scale(0.9)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'bounce-in': {
					'0%': { transform: 'scale(0.3)', opacity: '0' },
					'50%': { transform: 'scale(1.05)' },
					'70%': { transform: 'scale(0.9)' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'pulse-soft': {
					'0%, 100%': { transform: 'scale(1)', opacity: '1' },
					'50%': { transform: 'scale(1.05)', opacity: '0.8' }
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'slide-in': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out forwards',
				'slide-in': 'slide-in 0.7s ease-out forwards',
				'scale-in': 'scale-in 0.6s ease-out forwards',
				'bounce-in': 'bounce-in 0.8s ease-out forwards',
				'pulse-soft': 'pulse-soft 2s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
