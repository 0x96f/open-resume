const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["@heroicons/react", "@react-pdf/renderer"],
  },
  // @react-pdf/renderer optionally pulls in Node-only modules (canvas, encoding).
  // Alias them to an empty stub in the browser bundle to avoid build errors.
  output: "standalone",
  transpilePackages: ["@react-pdf/renderer"],
  turbopack: {
    resolveAlias: {
      canvas: {
        browser: path.join(__dirname, "src/lib/empty-module.js"),
      },
      encoding: {
        browser: path.join(__dirname, "src/lib/empty-module.js"),
      },
    },
  },
};

module.exports = nextConfig;
