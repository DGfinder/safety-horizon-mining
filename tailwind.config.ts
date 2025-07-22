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
				'2xl': '1200px'
			}
		},
		extend: {
			typography: {
				DEFAULT: {
					css: {
						'--tw-prose-body': '#78716c',
						'--tw-prose-headings': '#1c1917',
						'--tw-prose-lead': '#57534e',
						'--tw-prose-links': '#f97316',
						'--tw-prose-bold': '#1c1917',
						'--tw-prose-counters': '#57534e',
						'--tw-prose-bullets': '#a8a29e',
						'--tw-prose-hr': '#e7e5e4',
						'--tw-prose-quotes': '#1c1917',
						'--tw-prose-quote-borders': '#e7e5e4',
						'--tw-prose-captions': '#57534e',
						'--tw-prose-code': '#1c1917',
						'--tw-prose-pre-code': '#e7e5e4',
						'--tw-prose-pre-bg': '#292524',
						'--tw-prose-th-borders': '#e7e5e4',
						'--tw-prose-td-borders': '#f5f5f4',
						maxWidth: 'none',
						lineHeight: '1.7',
						p: {
							marginTop: '1.25em',
							marginBottom: '1.25em',
						},
						h2: {
							marginTop: '2em',
							marginBottom: '1em',
							fontSize: '1.5em',
							lineHeight: '1.3',
							fontWeight: '700',
						},
						h3: {
							marginTop: '1.6em',
							marginBottom: '0.6em',
							fontSize: '1.25em',
							lineHeight: '1.4',
							fontWeight: '600',
						},
						ul: {
							marginTop: '1.25em',
							marginBottom: '1.25em',
						},
						ol: {
							marginTop: '1.25em',
							marginBottom: '1.25em',
						},
						li: {
							marginTop: '0.5em',
							marginBottom: '0.5em',
						},
						a: {
							color: '#f97316',
							textDecoration: 'underline',
							fontWeight: '500',
						},
						strong: {
							fontWeight: '700',
						},
					},
				},
				sm: {
					css: {
						fontSize: '14px',
						lineHeight: '1.6',
						p: {
							marginTop: '1em',
							marginBottom: '1em',
						},
						h2: {
							fontSize: '1.4em',
							marginTop: '1.8em',
							marginBottom: '0.8em',
						},
						h3: {
							fontSize: '1.2em',
							marginTop: '1.4em',
							marginBottom: '0.6em',
						},
					},
				},
				lg: {
					css: {
						fontSize: '18px',
						lineHeight: '1.8',
						p: {
							marginTop: '1.3em',
							marginBottom: '1.3em',
						},
						h2: {
							fontSize: '1.6em',
							marginTop: '2.2em',
							marginBottom: '1.2em',
						},
						h3: {
							fontSize: '1.3em',
							marginTop: '1.8em',
							marginBottom: '0.8em',
						},
					},
				},
			},
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
				navy: 'hsl(207 100% 17%)',
				orange: 'hsl(29 100% 38%)',
				'near-black': 'hsl(220 9% 6.7%)',
				brand: {
					orange: {
						50: '#faefe7',
						100: 'rgb(239, 204, 181)',
						200: '#e7b491',
						300: '#db925e',
						400: '#d57d3f',
						500: '#ca5c0f',
						600: '#b8540e',
						700: '#8f410b',
						800: '#6f3308',
						900: '#552706',
					},
					brown: {
						50: '#eeeae7',
						100: '#c9beb6',
						200: '#af9f92',
						300: '#8b7360',
						400: '#755841',
						500: '#522e12',
						600: '#4b2a10',
						700: '#3a210d',
						800: '#2d190a',
						900: '#221308',
					},
					yellow: {
						50: '#fefaf4',
						100: '#fcf0de',
						200: '#fbe8cd',
						300: '#f9deb7',
						400: '#f8d8a9',
						500: '#f6ce93',
						600: '#e0bb86',
						700: '#af9268',
						800: '#877151',
						900: '#67573e',
					},
					white: '#ffffff',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				'sans': ['Work Sans', 'system-ui', 'sans-serif'],
				'heading': ['Inter', 'system-ui', 'sans-serif'],
			},
			maxWidth: {
				'content': '1200px',
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
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'counter': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'counter': 'counter 0.8s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
