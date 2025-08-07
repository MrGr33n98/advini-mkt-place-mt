/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config) => {
    if (process.env.NODE_ENV === "development") {
      config.module.rules.push({
        test: /\.(jsx|tsx)$/,
        exclude: /node_modules/,
        enforce: "pre",
        use: "@dyad-sh/nextjs-webpack-component-tagger",
      });
    }
    return config;
  },
  // Rails API proxy configuration
  async rewrites() {
    return [
      {
        source: '/rails-api/:path*',
        destination: 'http://localhost:3001/api/v1/:path*',
      },
      {
        source: '/rails-admin/:path*',
        destination: 'http://localhost:3001/admin/:path*',
      },
    ];
  },
};

module.exports = nextConfig;