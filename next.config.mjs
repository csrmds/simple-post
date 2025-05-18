/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  //http://res.cloudinary.com/dufaejhwh/image/upload/v1747349920/6826719eb2cd4bb5197e22b7_0.jpg
  images: {
    remotePatterns: [{
        protocol: 'http',
        hostname: 'res.cloudinary.com',
        pathname: '/dufaejhwh/**',
    }]
  }
};

export default nextConfig;
