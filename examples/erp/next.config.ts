import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@kivotos/core', '@kivotos/next'],
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
