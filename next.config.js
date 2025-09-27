/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['ipfs.io', 'gateway.pinata.cloud', 'cloudflare-ipfs.com'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    
    // Ignore React Native modules
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false,
    };
    
    return config;
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
