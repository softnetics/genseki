import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@repo/drizzlify', '@repo/drizzlify-next'],
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
