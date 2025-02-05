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
          "base-100": "#f3f5f6",
          "info": "#0ea5e9",
          "success": "#6ee7b7",
          "warning": "#fde047",
          "error": "#f87171",  
        },
        mydarktheme: {
          "primary": "#877A9E",
          "secondary": "#BDB7ED",
          "accent": "#1f2937",
          "neutral": "#3C2F47",
          "base-100": "#3C2F47",
          "info": "#2196f3",
          "success": "#4caf50",
          "warning": "#fb8c00",
          "error": "#f44336",  
        },
      },
    ],
  },
};

