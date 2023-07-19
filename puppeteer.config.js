const { join } = require("path");

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // skipDownload:true,
  cacheDirectory: join(__dirname, "puppeteer"),
  logLevel: "warn",
  defaultProduct: "chrome",
  browserRevision: "114.0.5735.133",
  ...(process?.env?.NODE_ENV === "production" && {
    executablePath:
      "/home/jon89071/piu-db/puppeteer/chrome/linux64-114.0.5735.133/chrome-linux64/chrome",
  }),
};
