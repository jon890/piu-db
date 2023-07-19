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
};
