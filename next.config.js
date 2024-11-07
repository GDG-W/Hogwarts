import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  reactStrictMode: true,
  // Ensures that Sass looks for .scss files in the styles directory
  sassOptions: {
    includePaths: [path.join(new URL('.', import.meta.url).pathname, 'src/styles')],
  },
  // Allows for import and use of SVGs as jsx components
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

export default nextConfig;
