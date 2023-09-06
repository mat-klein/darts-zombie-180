/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      dropShadow: {
        sm: "0 0px 3px rgba(255, 255, 255, 1)",
      },
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#fdfdfd", //rgb(253,253,253)
      grey: {
        100: "#E6E6E6", //rgb(230,230,230)
        200: "#B3B3B3", //rgb(179,179,179)
        300: "#808080", //rgb(128,128,128)
        400: "#4D4D4D", //rgb(77,77,77)
        500: "#1A1A1A", //rgb(26,26,26)
      },
      red: {
        100: "#e2cdd0", //rgb(226,205,208)
        200: "#b48782", //rgb(180,135,130)
        300: "#8f525d", //rgb(143,82,93)
        400: "#6f2130", //rgb(111,33,48)
        500: "#531827", //rgb(83,24,39)
      },
      green: {
        100: "#D5F0E1", //rgb(213,240,225)
        200: "#5FAB97", //rgb(95,171,151)
        300: "#22634F", //rgb(34,99,79)
        400: "#0A301D", //rgb(10,48,29)
        500: "#032304", //rgb(3,35,4)
      },
      blue: {
        100: "#d5e3e6", //rgb(213,227,230)
        200: "#5f97ab", //rgb(95,151,171)
        300: "#224c63", //rgb(34,76,99)
        400: "#0a1d30", //rgb(10,29,48)
        500: "#030418", //rgb(3,4,24)
      },
    },
  },
  plugins: [],
};
