const { join } = require("path");

const chromeVersion = "114.0.5735.133";

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // skipDownload:true,
  cacheDirectory: join(__dirname, "puppeteer"),
  logLevel: "warn",
  defaultProduct: "chrome",
  browserRevision: chromeVersion,
  ...(process?.env?.NODE_ENV === "production" && {
    executablePath: join(
      __dirname,
      "chrome",
      `linux64-${chromeVersion}`,
      "chrome-linux64",
      "chrome"
    ),
  }),
};
