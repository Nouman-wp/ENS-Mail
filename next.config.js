/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['ipfs.io', 'gateway.pinata.cloud', 'cloudflare-ipfs.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/ipfs/:path*',
        destination: 'https://ipfs.io/ipfs/:path*',
      },
    ];
  },
  // Configuration for .eth.limo hosting
  trailingSlash: true,
  exportPathMap: async function () {
    return {
      '/': { page: '/' },
      '/register': { page: '/register' },
      '/dashboard': { page: '/dashboard' },
      '/profile': { page: '/profile/[subname]' },
    };
  },
};

module.exports = nextConfig;
