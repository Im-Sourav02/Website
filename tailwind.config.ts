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
        background: '#0b0f19', // Deep dark mode base
        surface: '#111827',    // Surface color
        accent: {
          blue: '#3b82f6',     // Tech-focused blue
          green: '#10b981',    // Success green
        },
        text: {
          primary: '#ffffff',
          secondary: '#9ca3af', // Light gray
        }
      },
    },
  },
  plugins: [],
}
export default config
