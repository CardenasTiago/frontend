
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
          "neutral": "#ffffff",
          "base-100": "#F8F6FF",
          "info": "#0ea5e9",
          "success": "#6ad838",
          "warning": "#fde047",
          "error": "#f44336",
        },
        mydarktheme: {
          "primary": "#6B48FF",
          "secondary":"#a78bfa",
          "accent": "#f9fafb",
          "neutral": "#0D0D0D",
          "base-100": "#252525",
          "info": "#2196f3",
          "success": "#4caf50",
          "warning": "#fb8c00",
          "error": "#f54242",
        },
      },
    ],
  },
};

