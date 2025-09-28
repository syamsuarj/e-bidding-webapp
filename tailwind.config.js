/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0f9f6e',
          dark: '#0b7d56',
        },
        secondary: {
          DEFAULT: '#9fe870',
          dark: '#5ecb66',
        },
        background: '#f3f9f4',
        surface: '#ffffff',
        muted: '#89a29a',
        text: '#0f172a',
        border: 'rgba(146, 197, 168, 0.28)',
      },
      fontFamily: {
        jakarta: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 40px 80px -40px rgba(9, 83, 48, 0.24)',
        card: '0 24px 50px -30px rgba(9, 83, 48, 0.18)',
        buttonPrimary: '0 18px 40px -22px rgba(15, 159, 110, 0.55)',
        buttonPrimaryHover: '0 30px 60px -30px rgba(15, 159, 110, 0.6)',
        buttonSecondary: '0 18px 40px -22px rgba(94, 203, 102, 0.55)',
        buttonSecondaryHover: '0 30px 60px -32px rgba(94, 203, 102, 0.5)',
        brand: '0 12px 24px -18px rgba(15, 115, 80, 0.28)',
      },
      borderRadius: {
        xl: '28px',
        lg: '20px',
        md: '14px',
        sm: '10px',
      },
      spacing: {
        15: '3.75rem',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        floaty: 'floaty 4.5s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      },
      backdropBlur: {
        sm: '6px',
      },
    },
  },
  plugins: [],
};
