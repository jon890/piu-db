const getCorsHeaders = () => {
  const headers = {};
  headers["Access-Control-Allow-Origin"] =
    "http://localhost:3000,https://piudb.com,https://www.piudb.com";
  headers["Access-Control-Allow-Credentials"] = "true";
  headers["Access-Control-Allow-Methods"] = "GET,OPTIONS,PATCH,DELETE,POST,PUT";
  headers["Access-Control-Allow-Headers"] =
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization";

  return Object.entries(headers).map(([key, value]) => ({ key, value }));
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  compress: true,
  swcMinify: true,
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;
