/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],

  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#6B48FF",
          "secondary": "#a78bfa",
          "accent": "#111827",
          "neutral": "#f3f4f6",
          "base-100": "#f3f4f6",
          "info": "#0ea5e9",
          "success": "#6ee7b7",
          "warning": "#fde047",
          "error": "#f87171",  
        },
      },
    ],
  },
};

