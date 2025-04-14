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
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
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
        success: {
          DEFAULT: '#10B981',
          50: '#E6FAF5',
          100: '#D0F6EB',
          200: '#A0EEDC',
          300: '#71E5CD',
          400: '#41DDBD',
          500: '#22C9A6',
          600: '#1EB380',
          700: '#10B981',
          800: '#0D9268',
          900: '#076E4F',
        },
        warning: {
          DEFAULT: '#F59E0B',
          50: '#FEF7EA',
          100: '#FDEFD0',
          200: '#FBDFA3',
          300: '#F9CE74',
          400: '#F7BE45',
          500: '#F5AD17',
          600: '#F59E0B',
          700: '#C27B08',
          800: '#925C06',
          900: '#613D04',
        },
        info: {
          DEFAULT: '#0EA5E9',
          50: '#E6F6FE',
          100: '#CFF1FD',
          200: '#9EE3FB',
          300: '#6FD5F9',
          400: '#3EC8F7',
          500: '#18B7F5',
          600: '#0EA5E9',
          700: '#0B83BA',
          800: '#08628C',
          900: '#05425D',
        },
        danger: {
          DEFAULT: '#EF4444',
          50: '#FEF0F0',
          100: '#FDE2E2',
          200: '#FBC6C6',
          300: '#F9A8A8',
          400: '#F78B8B',
          500: '#F56D6D',
          600: '#EF4444',
          700: '#E12D2D',
          800: '#B92020',
          900: '#911A1A',
        }
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
