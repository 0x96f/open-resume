import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      components: path.resolve(__dirname, "./src/features/resume/components"),
      lib: path.resolve(__dirname, "./src/lib"),
      home: path.resolve(__dirname, "./src/features/marketing"),
      "globals.css": path.resolve(__dirname, "./src/app/globals.css"),
      "globals-css": path.resolve(__dirname, "./src/app/globals-css.ts"),
    },
  },
});
