/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: false, // we register manually in app/providers.tsx
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: require('next-pwa/cache'),
  buildExcludes: [/middleware-manifest\.json$/]
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com', 'ui-avatars.com']
  },
  // Disable PWA for deployment testing
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client']
  }
};

module.exports = withPWA(nextConfig);
