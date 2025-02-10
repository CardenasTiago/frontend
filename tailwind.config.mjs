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
          "secondary": "#1F175C",
          "accent": "#111827",
          "neutral": "#f9fafb",
          "base-100": "#f9fafb",
          "info": "#0ea5e9",
          "success": "#6ee7b7",
          "warning": "#fde047",
          "error": "#f87171",  
        },
        mydarktheme: {
          "primary": "#846AFA",
          "secondary":"#CCBCFC",
          "accent": "#BBC8E2",
          "neutral": "#0D0D0D",
          "base-100": "#0D0D0D",
          "info": "#2196f3",
          "success": "#4caf50",
          "warning": "#fb8c00",
          "error": "#f44336",  
        },
      },
    ],
  },
};

