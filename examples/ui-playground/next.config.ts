import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@genseki/react', '@genseki/next'],
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
