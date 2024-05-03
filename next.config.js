/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  compress: true,
  swcMinify: true,
  productionBrowserSourceMaps: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.piugame.com",
        port: "",
        pathname: "/data/song_img/*",
      },
    ],
  },
};

module.exports = nextConfig;
