module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', '"Trebuchet MS"', 'sans-serif'],
        display: ['"Space Grotesk"', '"Trebuchet MS"', 'sans-serif']
      },
      colors: {
        tru: {
          blue: '#003e51',
          teal: '#00b0b9',
          sage: '#bad1ba',
          grey: '#9ab7c1',
          yellow: '#ffcd00',
          cloud: '#fff5de'
        },
        ol: {
          green: '#00b18f'
        }
      },
      boxShadow: {
        soft: '0 12px 30px rgba(31, 42, 46, 0.12)'
      },
      borderRadius: {
        xl: '1.25rem'
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(15, 118, 110, 0.35)' },
          '70%': { boxShadow: '0 0 0 10px rgba(15, 118, 110, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(15, 118, 110, 0)' }
        }
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out',
        'pulse-ring': 'pulse-ring 2s ease-out infinite'
      }
    }
  },
  plugins: []
};
