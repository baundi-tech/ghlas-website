// tailwind.config.ts
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
        brand: {
          darkForest: '#3A5A3A',
          deepCanopy: '#1B2A1B',
          forest: '#2C5F2D',
          shadow: '#2A3D2A',
          leaf: '#4A9B4F',
          sage: '#90B090',
          muted: '#6B7B6B',
        },
        neutral: {
          white: '#FFFFFF',
          paleMint: '#EAF0EA',
          coolGray: '#D0D8D0',
          lightGray: '#D0D0D0',
          warmCream: '#F5F0E8',
          nearBlack: '#2D2D2D',
          black: '#000000',
          sage: '#90B090',
        },
        accent: {
          golden: '#C7943E',
          darkGold: '#8B6914',
          yellow: '#FFC000',
          orange: '#ED7D31',
          alert: '#C0392B',
          brown: '#5D4037',
          link: '#1565C0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'mesh-pulse': 'meshPulse 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        meshPulse: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
}

export default config