import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      width: {
        '104': '26rem',
        '120': '30rem',
        '140': '35rem',
        '144': '36rem', // 576px
        '160': '40rem', // 640px
        '192': '48rem', // 768px
        '224': '56rem', // 896px
        '256': '64rem', // 1024px
        '288': '72rem', // 1152px
        '320': '80rem', // 1280px
        '384': '96rem', // 1536px
        '480': '120rem', // 1920px
      },
      height: {
        '104': '26rem',
        '120': '30rem',
        '140': '35rem',
        '144': '36rem', // 576px
        '160': '40rem', // 640px
        '192': '48rem', // 768px
        '224': '56rem', // 896px
        '256': '64rem', // 1024px
        '288': '72rem', // 1152px
        '320': '80rem', // 1280px
        '384': '96rem', // 1536px
        '480': '120rem', // 1920px
      },
      maxHeight: {
        '104': '26rem',
        '120': '30rem',
        '140': '35rem',
        '144': '36rem', // 576px
        '160': '40rem', // 640px
        '192': '48rem', // 768px
        '224': '56rem', // 896px
        '256': '64rem', // 1024px
        '288': '72rem', // 1152px
        '320': '80rem', // 1280px
        '384': '96rem', // 1536px
        '480': '120rem', // 1920px
      }
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require('daisyui'),
  ],

  daisyui: {
    themes: [
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
    ], // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: "night",   //"light", // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ":root", // The element that receives theme color CSS variables
  }
};



export default config;
