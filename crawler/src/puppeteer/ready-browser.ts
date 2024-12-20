import puppeteer, { Browser } from "puppeteer";

export const getBrowser = async () => {
  const browser = await puppeteer.launch({
    // 가상 브라우저 실행
    // headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process",
      "--disable-gpu",
    ],
  });

  return browser;
};

export const getPageWithNotImage = async (browser: Browser) => {
  const page = await browser.newPage();

  await page.setRequestInterception(true);
  await page.setViewport({ width: 1920, height: 1080 });

  page.on("request", (req) => {
    switch (req.resourceType()) {
      case "image":
      case "font":
      case "stylesheet":
        req.abort();
        return;
    }

    req.continue();
  });

  return page;
};
