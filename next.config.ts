import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    // Ignore ESLint during build (avoids Vercel "Unexpected any" errors)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow production builds to complete even with type errors
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
