// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Replace deprecated images.domains with images.remotePatterns
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
        pathname: '/**',
      },
    ],
  },
  // Remove the deprecated 'swcMinify' key entirely.
  // SWC minification is now the default and always enabled.

  // 'optimizePackageImports' is an experimental feature.
  // The warning is informational. You can keep it or remove it if you prefer a clean log.
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
}

module.exports = nextConfig