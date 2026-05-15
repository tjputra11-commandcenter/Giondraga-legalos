/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Enable for Vercel deployment
  distDir: 'dist',
  // Environment variables available at build time
  env: {
    NEXT_PUBLIC_APP_NAME: 'Giondraga LegalOS',
  },
}

module.exports = nextConfig
