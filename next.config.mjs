/** @type {import('next').NextConfig} */
console.log('▶API_BASE_URL (build):', process.env.API_BASE_URL)
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
        //destination: `http://localhost:8080/api/:path*`
      },
    ]
  },
}

export default nextConfig
