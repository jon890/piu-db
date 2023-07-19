import { LoginParams } from "@/app/crawling/page";
import puppeteer from "puppeteer";
import utils from "../utils";

interface LoginToPiuCallback {
  onLaunchBrowser?: () => void | Promise<void>;
  onMoveLoginPage?: () => void | Promise<void>;
  onLoginComplete?: () => void | Promise<void>;
  onError?: () => void | Promise<void>;
}

/**
 * 펌프 잇업에 로그인
 * @param params
 */
export default async function loginToPiu(
  params: LoginParams,
  {
    onLaunchBrowser,
    onMoveLoginPage,
    onError,
    onLoginComplete,
  }: LoginToPiuCallback
) {
  try {
    const browser = await puppeteer.launch({
      headless: true,
    });

    await onLaunchBrowser?.();

    const page = await browser.newPage();
    await page.goto("https://www.piugame.com/");

    await onMoveLoginPage?.();

    const idElement = await page.waitForSelector("input[name='mb_id']");
    const passwordElement = await page.waitForSelector(
      "input[name='mb_password']"
    );
    const loginBtnElement = await page.waitForSelector("button.btn.st1");

    await idElement?.type(params.email);
    await passwordElement?.type(params.password);
    await loginBtnElement?.click();

    await utils.sleep(500);

    try {
      const loginCheck = await page.waitForSelector(
        "div.login_wrap a.loginBtn",
        { timeout: 1000 }
      );
      const btnText = await loginCheck?.$eval("i.tt", (el) => el.textContent);
      if (btnText !== "로그아웃") {
        throw Error("Login Failed");
      }
    } catch (e) {
      console.error(e);
      throw Error("Login Failed");
    }

    await page.close();
    await browser.close();

    await onLoginComplete?.();
  } catch (e) {
    await onError?.();
  }
}
