/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Semantic Tokens Mapping
        primary: "#5CB85C",           // Sage Green
        secondary: "#FFB84D",         // Warm Amber
        background: "#FFFDF7",        // Cream White
        accent: "#EF6C57",            // Coral
        
        surface: "#FFFFFF",
        surfaceSecondary: "#F8FAF8",
        
        textPrimary: "#2F3437",       // Charcoal (Never #000000)
        textSecondary: "#6B7280",
        textMuted: "#9CA3AF",
        textInverse: "#FFFDF7",
        
        borderDefault: "#E5E7EB",
        borderFocused: "#5CB85C",
        
        disabledBg: "#F3F4F6",
        disabledText: "#9CA3AF",
        
        streakBg: "#FFF7E6",
        streakBorder: "#FFE0A3",
        streakText: "#FF8A00",

        success: "#5CB85C",
        warning: "#FFB84D",
        error: "#EF6C57",
        info: "#3B82F6",
      },
      borderRadius: {
        'card': '20px',
        'card-lg': '24px',
        'button': '16px',
      },
    },
  },
  plugins: [],
}
