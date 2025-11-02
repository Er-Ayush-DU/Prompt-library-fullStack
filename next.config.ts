// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   images: {
//     domains: [], // Add domains if using external images
//   },
//   // Optional: Add image optimization or other SEO tweaks
// };

// module.exports = nextConfig;


import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'prompt-library-ayush.s3.eu-north-1.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'prompt-library-ayush.s3.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;