/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1E3A8A",    // Deep blue — trust
        secondary: "#059669",  // Emerald — verification
        surface: "#F8FAFC",    // Light background
        ink: "#0F172A",        // Dark navy text
        danger: "#DC2626",
        warning: "#D97706",
      },
      backdropBlur: {
        glass: "12px",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(30, 58, 138, 0.08)",
      },
    },
  },
  plugins: [],
};