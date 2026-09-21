import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#2b1416",
        muted: "#8c7073",
        maroon: "#571313",
        brick: "#b22222",
        soft: "#fbf5f4",
        line: "#f0dfdd",
        tint: "#faeceb",
      },
      boxShadow: {
        soft: "0 12px 30px rgba(87, 19, 19, .08)",
      },
    },
  },
  plugins: [],
};

export default config;
