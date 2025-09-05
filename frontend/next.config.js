/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', '127.0.0.1'],
  },
  env: {
    CUSTOM_KEY: 'clearpath-ai',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*', // Backend API
      },
      {
        source: '/ws/:path*',
        destination: 'http://localhost:8001/ws/:path*', // WebSocket server
      },
    ];
  },
}

module.exports = nextConfig
