import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-bebas)'],
        body: ['var(--font-dm-sans)'],
        mono: ['var(--font-dm-mono)'],
      },
      colors: {
        bg: '#0b0b09',
        surface: '#131310',
        surface2: '#1c1c18',
        surface3: '#242420',
        accent: '#e8ff47',
        accent2: '#ff6b35',
        muted: '#7a7870',
        muted2: '#5a5855',
      },
    },
  },
  plugins: [],
}
export default config
