import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  typedRoutes: true,
  // Security headers are set in middleware so the CSP nonce is per-request.
  // Do not duplicate them here.
}

export default nextConfig
