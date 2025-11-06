import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // IMAGE CONFIGURATION
  images: {
    // FOR EXTERNAL IMAGES (S3, Unsplash, etc.)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'prompt-library-ayush.s3.eu-north-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'prompt-library-ayush.s3.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
    ],

    // FOR LOCAL IMAGES (public folder)
    domains: ['localhost'],

    // OPTIONAL: Improve image loading
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // OPTIONAL: Performance & SEO
  poweredByHeader: false,
  compress: true,
  swcMinify: true,

  // OPTIONAL: Environment Variables
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
};

export default nextConfig;