// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true, // Jika kamu tetap ingin load gambar SVG dari dicebear
  },
};

export default nextConfig;