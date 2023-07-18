import { LoginParams } from "@/app/crawling/page";
import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
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
  const cookies = await handleAmPassLogin(LoginParams.parse(reqBody));
  return NextResponse.json({ successful: true, data: { cookies } });
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

  const cookies = await page.cookies();

  await page.close();
  await browser.close();

  console.debug("login checked");
  return cookies.find((cookie) => cookie.name === "PHPSESSID");
}
