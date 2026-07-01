/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Vazirmatn_400Regular"],
        sansMedium: ["Vazirmatn_500Medium"],
        sansBold: ["Vazirmatn_700Bold"],
      },
      colors: {
        background: "#fdfcfc", // 30 33% 99% warm white
        foreground: "#2a2225", // 340 10% 15% warm near-black
        primary: {
          DEFAULT: "#ae425d", // 345 45% 47% muted rose
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#f8f2f3", // 345 30% 96% soft blush
          foreground: "#67323f", // 345 35% 30%
        },
        muted: {
          DEFAULT: "#f4f2f0", // 30 15% 95% warm grey
          foreground: "#7a6c70", // 340 6% 45%
        },
        accent: {
          DEFAULT: "#f6eaed", // 345 38% 94% blush accent
          foreground: "#602e3b", // 345 35% 28%
        },
        destructive: {
          DEFAULT: "#d92626", // 0 70% 50%
          foreground: "#ffffff",
        },
        border: "#e9e6e2", // 30 12% 90%
      },
      borderRadius: {
        lg: "10px",
        md: "8px",
        sm: "6px",
      },
    },
  },
  plugins: [],
};
