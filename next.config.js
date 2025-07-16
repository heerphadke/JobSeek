/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        pathname: '/api/**',
      },
    ],
  },
  experimental: {
    largePageDataBytes: 128 * 100000,
  },
  reactStrictMode: true,
}

module.exports = nextConfig 