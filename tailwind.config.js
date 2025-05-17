// const plugin = require("tailwindcss/plugin");

// module.exports = {
//   darkMode: ["class"],
//   content: [
//     "./pages/**/*.{ts,js,jsx,tsx}",
//     "./components/**/*.{ts,js,jsx,tsx}",
//     "./app/**/*.{ts,js,jsx,tsx}",
//     "./src/**/*.{ts,js,jsx,tsx}",
//   ],
//   prefix: "",
//   theme: {
//     container: {
//       center: true,
//       padding: '2rem',
//       screens: {
//         '2xl': '1400px'
//       }
//     },
//     extend: {
//       colors: {
//         border: 'hsl(var(--border))',
//         input: 'hsl(var(--input))',
//         ring: 'hsl(var(--ring))',
//         background: 'hsl(var(--background))',
//         foreground: 'hsl(var(--foreground))',
//         primary: {
//           DEFAULT: 'hsl(var(--primary))',
//           foreground: 'hsl(var(--primary-foreground))'
//         },
//         secondary: {
//           DEFAULT: 'hsl(var(--secondary))',
//           foreground: 'hsl(var(--secondary-foreground))'
//         },
//         destructive: {
//           DEFAULT: 'hsl(var(--destructive))',
//           foreground: 'hsl(var(--destructive-foreground))'
//         },
//         muted: {
//           DEFAULT: 'hsl(var(--muted))',
//           foreground: 'hsl(var(--muted-foreground))'
//         },
//         accent: {
//           DEFAULT: 'hsl(var(--accent))',
//           foreground: 'hsl(var(--accent-foreground))'
//         },
//         popover: {
//           DEFAULT: 'hsl(var(--popover))',
//           foreground: 'hsl(var(--popover-foreground))'
//         },
//         card: {
//           DEFAULT: 'hsl(var(--card))',
//           foreground: 'hsl(var(--card-foreground))'
//         },
//         sidebar: {
//           DEFAULT: 'hsl(var(--sidebar-background))',
//           foreground: 'hsl(var(--sidebar-foreground))',
//           primary: 'hsl(var(--sidebar-primary))',
//           'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
//           accent: 'hsl(var(--sidebar-accent))',
//           'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
//           border: 'hsl(var(--sidebar-border))',
//           ring: 'hsl(var(--sidebar-ring))'
//         },
//         ecochain: {
//           dark: '#1A1F2C',
//           light: '#F2FCE2',
//           green: {
//             100: '#F2FCE2',
//             200: '#E3F5C4',
//             300: '#D4EEA6',
//             400: '#A4C466',
//             500: '#6B8E23',
//             600: '#556B2F',
//             700: '#3D4F1F',
//           },
//           accent: '#8DAA53',
//           secondary: '#4A5D2F',
//           neutral: {
//             100: '#F8FAEF',
//             200: '#E8EADF',
//             300: '#C8CAB0',
//             400: '#9A9B85',
//             500: '#6C6D5D',
//           }
//         }
//       },
//       borderRadius: {
//         lg: 'var(--radius)',
//         md: 'calc(var(--radius) - 2px)',
//         sm: 'calc(var(--radius) - 4px)'
//       },
//       keyframes: {
//         'accordion-down': {
//           from: { height: '0' },
//           to: { height: 'var(--radix-accordion-content-height)' }
//         },
//         'accordion-up': {
//           from: { height: 'var(--radix-accordion-content-height)' },
//           to: { height: '0' }
//         }
//       },
//       animation: {
//         'accordion-down': 'accordion-down 0.2s ease-out',
//         'accordion-up': 'accordion-up 0.2s ease-out'
//       },
//       backgroundImage: {
//         'eco-pattern': "url('/public/eco-pattern.png')",
//       }
//     }
//   },
//   plugins: [require("tailwindcss-animate")],
// };

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,js,jsx,tsx}',
    './components/**/*.{ts,js,jsx,tsx}',
    './app/**/*.{ts,js,jsx,tsx}',
    './src/**/*.{ts,js,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
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
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        ecochain: {
          dark: '#1A1F2C',
          light: '#F2FCE2',
          green: {
            100: '#F2FCE2',
            200: '#E3F5C4',
            300: '#D4EEA6',
            400: '#A4C466',
            500: '#6B8E23',
            600: '#556B2F',
            700: '#3D4F1F',
          },
          accent: '#8DAA53',
          secondary: '#4A5D2F',
          neutral: {
            100: '#F8FAEF',
            200: '#E8EADF',
            300: '#C8CAB0',
            400: '#9A9B85',
            500: '#6C6D5D',
          },
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      backgroundImage: {
        'eco-pattern': "url('/eco-pattern.png')", // Removed `/public/` prefix for Tailwind
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
