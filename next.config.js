const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["@heroicons/react", "@react-pdf/renderer"],
  },
  // Nextjs has an issue with pdfjs-dist which optionally uses the canvas package
  // for Node.js compatibility. This causes a "Module parse failed" error when
  // building the app. Since pdfjs-dist is only used on client side, we alias
  // optional Node-only modules to an empty stub in the browser bundle.
  // https://github.com/mozilla/pdf.js/issues/16214
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
