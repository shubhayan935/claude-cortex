/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'], // Add your domains here for Image optimization
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/:path*', // Proxy API requests to FastAPI backend
      },
      {
        source: '/session_screenshots/:path*',
        destination: 'http://localhost:8000/session_screenshots/:path*', // Proxy screenshots
      },
    ];
  },
};

module.exports = nextConfig;