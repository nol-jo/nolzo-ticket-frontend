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
        destination: `http://localhost:8080/api/:path*` 
        // destination: `http://3.106.200.215:8080/api/:path*` 
      },
    ]
  },
}

export default nextConfig
