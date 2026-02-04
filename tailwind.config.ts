import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      colors: {
        background: {
          light: '#fafafa',
          dark: '#0d0d0d'
        }
      },
      animation: {
        'pulse-slow': 'pulse-glow 3s infinite ease-in-out'
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.1)' }
        }
      }
    }
  }
}
