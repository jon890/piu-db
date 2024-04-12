const colors = require("tailwindcss/colors");

const warningColors = [
  "lightBlue",
  "warmGray",
  "trueGray",
  "coolGray",
  "blueGray",
];
const notWarningColors = Object.entries(colors).filter(([colorKey, value]) => {
  return !warningColors.includes(colorKey);
});

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      rough: "#973d0c",
      talented: "#e5e3e2",
      superb: "#dcc78a",
      ultimate: "#70d0fb",
      transparent: "transparent",
      current: "currentColor",
      ...Object.fromEntries(notWarningColors),
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("daisyui")],
};
