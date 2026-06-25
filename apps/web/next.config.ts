import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@vetrinaria/db', '@vetrinaria/shared'],
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-*'],
    turbo: {
      resolveExtensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
