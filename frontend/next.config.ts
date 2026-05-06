import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://backend:8080/:path*', // nome do serviço no compose
      },
    ];
  },
};

export default nextConfig;