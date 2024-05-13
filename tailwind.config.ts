import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      width: {
        "card-l": "480px",
        "c-600": "600px",
      },
      maxWidth: {
        "card-l": "480px",
        "c-600": "600px",
        "button": "200px"
      },
    },
  },
  plugins: [],
} satisfies Config;
