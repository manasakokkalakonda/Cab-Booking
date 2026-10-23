/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NODE_ENV === 'production' 
      ? 'https://your-backend-service.onrender.com/api' 
      : 'http://localhost:5000/api',
  },
};

module.exports = nextConfig;