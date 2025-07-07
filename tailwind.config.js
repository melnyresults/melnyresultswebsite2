/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'heading': ['Poppins', 'system-ui', 'sans-serif'],
        'body': ['Open Sans', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        'semibold': '600',
        'bold': '700',
      },
      colors: {
        primary: {
          red: '#C62828',
          blue: '#004080',
          navy: '#1C2D4A',
        },
        gray: {
          50: '#F9FAFB',
          100: '#F0F2F5',
          200: '#E5E7EB',
          300: '#D1D5DB',
          600: '#6B7280',
          700: '#374151',
          800: '#1F2937',
          900: '#222222',
        },
        blue: {
          50: '#F1F6FB',
        },
        red: {
          50: '#FBEAEA',
          600: '#C62828',
          700: '#B71C1C',
          800: '#A61B27',
        },
        navy: {
          50: '#F8F9FB',
          500: '#1C2D4A',
          600: '#162339',
          700: '#0F1A2E',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'bounce-soft': 'bounceSoft 1s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceSoft: {
          '0%': { transform: 'scale(0.3)' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' },
        }
      },
      boxShadow: {
        'premium': '0px 4px 12px rgba(0,0,0,0.08)',
        'premium-lg': '0px 8px 24px rgba(0,0,0,0.12)',
        'premium-xl': '0px 12px 32px rgba(0,0,0,0.15)',
      },
      letterSpacing: {
        'cta': '0.5px',
      }
    },
  },
  plugins: [],
};