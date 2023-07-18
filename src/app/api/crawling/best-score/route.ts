import { LoginParams } from "@/app/crawling/page";
import { NextRequest, NextResponse } from "next/server";
import puppeteer, { Browser, Dialog } from "puppeteer";
import { z } from "zod";

const LoginParams = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email type is incorrect",
    })
    .email({
      message: "Invalid email Address",
    }),
  password: z.string({ required_error: "Password is required" }),
});

export async function POST(request: NextRequest) {
  const reqBody = (await request.json()) as unknown;
  const bestScore = await handleAmPassLogin(LoginParams.parse(reqBody));

  return NextResponse.json({
    successful: true,
    data: { bestScore },
  });
}

async function handleAmPassLogin(params: LoginParams) {
  const browser = await puppeteer.connect({
    browserWSEndpoint: `wss://chrome.browserless.io/?token=${process.env.BLESS_TOKEN}`,
    // headless: true,
  });

  console.debug("launch browser");

  const page = await browser.newPage();
  await page.goto("https://www.piugame.com/");

  console.debug("move to piugame page");

  const idElement = await page.waitForSelector("input[name='mb_id']");
  const passwordElement = await page.waitForSelector(
    "input[name='mb_password']"
  );
  const loginBtnElement = await page.waitForSelector("button.btn.st1");

  console.debug("search element");

  await idElement?.type(params.email);
  await passwordElement?.type(params.password);
  await loginBtnElement?.click();

  console.debug("login checked");

  const bestScore = await getBestScore(browser);

  await page.close();
  await browser.close();

  return bestScore;
}

async function getBestScore(browser: Browser) {
  const page = await browser.newPage();

  const authFailedHandler = (dialog: Dialog) => {
    console.log("on dialog");
    if (dialog.message() === "Please try again after logging in.") {
      throw Error("Login failed");
    }
    return dialog.accept();
  };

  page.on("dialog", authFailedHandler);

  await page.goto("https://www.piugame.com/my_page/my_best_score.php");
  console.debug("move to my best score page");

  const data = await page.$$eval("ul.my_best_scoreList > li", (lis) =>
    lis.map((it) => {
      const type = it.querySelector("div.tw img"); // single or double
      const isDouble = (type as HTMLImageElement)?.src?.includes("d_text.png");
      const isSingle = (type as HTMLImageElement)?.src?.includes("s_text.png");

      const levelBalls = it.querySelectorAll("div.numw div.imG img");
      const level = Array.from(levelBalls)
        .map((it) => {
          const img = it as HTMLImageElement;
          const src = img?.src;
          const splits = src.split("/");
          const png = splits[splits.length - 1];
          const [ball] = png.split(".");
          const ballSplits = ball.split("_");
          return ballSplits[ballSplits.length - 1];
        })
        .join("");

      const songName = it.querySelector("div.song_name p")?.textContent;
      const score = it.querySelector(
        "div.li_in div.txt_v span.num"
      )?.textContent;

      return { isDouble, isSingle, level, songName, score };
    })
  );

  page.off("dialog", authFailedHandler);
  page.close();

  return data;
}
