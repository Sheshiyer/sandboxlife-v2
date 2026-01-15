/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    extend: {
      colors: {
        slate: colors.slate,
        // Keep existing papyrus colors
        bgpapyrus: '#f5f5dc',
        lightpapyrus: '#fafaf0',
        darkpapyrus: '#e5e5c7',
        red: '#9B1D1E',
        
        // Add new design system colors
        primary: {
          green: '#6FCF97',
          'green-light': '#7FD899',
          'green-pale': '#D4FCD9',
          'green-dark': '#5CB87E',
        },
        accent: {
          orange: '#F2994A',
          'orange-light': '#FF9E5A',
          'orange-pale': '#FEF3D4',
          'orange-dark': '#E08839',
          blue: '#56CCF2',
          'blue-light': '#66D4F1',
          'blue-pale': '#D4EDFC',
          'blue-dark': '#3DB8E0',
          teal: '#2D9CDB',
          'teal-light': '#3AA5E0',
          'teal-pale': '#C5E7F5',
          'teal-dark': '#2389C7',
        },
        neutral: {
          cream: '#FAFAF0',
          papyrus: '#F5F5DC',
          'papyrus-dark': '#E5E5C7',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'nature-xs': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'nature-sm': '0 2px 4px 0 rgba(0, 0, 0, 0.06), 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'nature-md': '0 4px 8px 0 rgba(0, 0, 0, 0.08), 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'nature-lg': '0 8px 16px 0 rgba(0, 0, 0, 0.12), 0 4px 8px 0 rgba(0, 0, 0, 0.08)',
        'nature-xl': '0 16px 32px 0 rgba(0, 0, 0, 0.16), 0 8px 16px 0 rgba(0, 0, 0, 0.12)',
      },
      transitionDuration: {
        '150': '150ms',
        '250': '250ms',
      },
    },
  },
  plugins: [],
};
