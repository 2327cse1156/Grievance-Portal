/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563eb", // Base primary blue
          dark: "#1e40af", // Darker shade for hover/focus
          light: "#3b82f6", // Lighter shade for highlights
        },
        success: "#10b981", // Green for success
        warning: "#f59e0b", // Amber for warnings
        danger: "#ef4444", // Red for errors
        info: "#06b6d4", // Cyan for info
      },
    },
  },
  plugins: [],
};
