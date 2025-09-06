/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  
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
        destination: process.env.BACKEND_API_URL || 'http://localhost:8000/api/:path*', // Backend API
      },
      {
        source: '/ws/:path*',
        destination: process.env.WEBSOCKET_URL || 'http://localhost:8001/ws/:path*', // WebSocket server
      },
    ];
  },
}

module.exports = nextConfig
