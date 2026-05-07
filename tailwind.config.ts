import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          pink: '#FFD1DC',
          lavender: '#E6E6FA',
          blue: '#B0E0E6',
          mint: '#C1FFC1',
          yellow: '#FFFACD',
          peach: '#FFE5B4',
          rose: '#FFB6C1',
          lilac: '#DDA0DD',
        },
      },
      fontFamily: {
        display: ['Quicksand', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 8px rgba(0, 0, 0, 0.08)',
        'soft-hover': '0 4px 12px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
