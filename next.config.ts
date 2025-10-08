/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // This pattern is good, it covers a specific, common host.
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        pathname: '/**',
      },
      // This covers another specific host.
      {
        protocol: 'https',
        hostname: 'mosaic.scdn.co',
        pathname: '/**',
      },
      // THE FINAL FIX: This wildcard pattern covers ALL of Spotify's
      // dynamic image CDNs like 'image-cdn-ak' and 'image-cdn-fa'.
      {
        protocol: 'https',
        hostname: '**.spotifycdn.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;