/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/api/:path*',                                         
        destination: `${process.env.API_BASE_URL}/api/:path*`
      },
    ]
  },
}

export default nextConfig
