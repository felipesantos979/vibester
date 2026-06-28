/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        foreground: '#ededed',
        fire: {
          DEFAULT: '#FF6B00',
          light: '#FF8A33',
          dark: '#CC5500',
          glow: 'rgba(255, 107, 0, 0.4)',
        },
        surface: {
          DEFAULT: '#0A0A0A',
          light: '#111111',
          lighter: '#1A1A1A',
        },
        muted: '#888888',
        border: 'rgba(255, 255, 255, 0.08)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        breathing: 'breathing 4s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        marquee: 'marquee 20s linear infinite',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
        shimmer: 'shimmer 3s ease-in-out infinite',
        'glow-border': 'glow-border 2.5s ease-in-out infinite',
        'sweep': 'sweep 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
      },
      keyframes: {
        breathing: {
          '0%, 100%': { transform: 'scale(0.95)', opacity: '0.4' },
          '50%': { transform: 'scale(1.3)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '0.8' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'glow-border': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(255,107,0,0.4), inset 0 0 8px transparent' },
          '50%': { boxShadow: '0 0 20px rgba(255,107,0,0.4), inset 0 0 8px rgba(255,107,0,0.1)' },
        },
        'sweep': {
          '0%': { left: '-100vw' },
          '100%': { left: '100vw' },
        }
      },
    },
  },
  plugins: [],
}
