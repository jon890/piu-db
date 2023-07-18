import { LoginParams } from "@/app/crawling/page";
import { Ephesis } from "next/font/google";
import { NextRequest, NextResponse } from "next/server";
import puppeteer, { Browser, Dialog, Page } from "puppeteer";
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
  await handleAmPassLogin(LoginParams.parse(reqBody));

  return NextResponse.json({
    successful: true,
    data: {},
  });
}

async function handleAmPassLogin(params: LoginParams) {
  const browser = await puppeteer.launch({
    headless: true,
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

  await getBestScore(browser);

  await page.close();
  await browser.close();
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

  const data = await page.$$eval("ul.my_best_scoreList li", (lis) =>
    lis.map((it) => it.innerHTML)
  );
  console.log(data);

  page.off("dialog", authFailedHandler);
  page.close();
}
