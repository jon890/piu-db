/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "burst.shopifycdn.com",
        port: "",
        pathname: "/photos/**",
      },
    ],
  },
};

module.exports = nextConfig;
