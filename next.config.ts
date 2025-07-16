import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // Prevents WebSockets from connecting twice in dev mode
};
module.exports = {
  pageExtensions: ['tsx', 'ts'],
};

export default nextConfig;
