/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        rough: "#973d0c",
        talented: "#e5e3e2",
        superb: "#dcc78a",
        ultimate: "#70d0fb",
        transparent: "transparent",
        current: "currentColor",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    safelist: [
      // reponsive-table-body.tsx
      "*:text-xs",
      "*:px-1",
      "*:py-0.5",
      "*:sm:px-2",
      "*:sm:py-1",
      "*:md:text-sm",
      "*:md:px-4",
      "*:md:py-2",
      "*:text-center",
    ],
  },
  plugins: [require("daisyui")],
};
