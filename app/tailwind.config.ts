// cimport type { Config } from "tailwindcss";

const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    flowbite.content(),
  ],
  theme: {
    extend: {},
  },
  plugins: [flowbite.plugin()],
};

// const config: Config = {
//   content: [
//     "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
//   ],
//   theme: {
//     extend: {
//       backgroundImage: {
//         "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
//         "gradient-conic":
//           "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
//         "gradient-defang":
//           "linear-gradient(311deg, rgba(63, 178, 175, .67), rgba(80, 54, 163, .67) 53%, rgba(9, 23, 76, .85)), linear-gradient(54deg, rgba(255, 131, 122, .25), rgba(255, 131, 122, 0) 28%), linear-gradient(241deg, rgba(228, 122, 255, .32), #d4f0f8 36%)",
//       },
//     },
//   },
//   plugins: [require("flowbite/plugin")],
// };
// export default config;
