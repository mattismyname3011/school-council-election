// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   output: "standalone",
//   /* config options here */
//   typescript: {
//     ignoreBuildErrors: true,
//   },
//   reactStrictMode: false,
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
