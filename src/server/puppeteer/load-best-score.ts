import { LoginParams } from "@/app/crawling/page";
import puppeteer from "puppeteer";
import utils from "../utils";

interface LoginToPiuCallback {
  onLaunchBrowser?: () => void | Promise<void>;
  onMoveLoginPage?: () => void | Promise<void>;
  onLoginComplete?: () => void | Promise<void>;
  onError?: (message: string) => void | Promise<void>;
  onLoadBestScore?: (data: BestScore[]) => void | Promise<void>;
  onFinish?: () => void | Promise<void>;
}

export type BestScore = {
  isDouble: boolean;
  isSingle: boolean;
  level: string;
  songName: string;
  score: string;
};

/**
 * 펌프 잇업에 로그인 후 베스트 스코어 가져오기
 * @param params
 */
export default async function loadBestScore(
  params: LoginParams,
  {
    onLaunchBrowser,
    onMoveLoginPage,
    onError,
    onLoginComplete,
    onLoadBestScore,
    onFinish,
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

    await onLoginComplete?.();

    await page.goto("https://www.piugame.com/my_page/my_best_score.php");

    const data = await page.$$eval("ul.my_best_scoreList > li", (lis) =>
      lis.map((it) => {
        const type = it.querySelector("div.tw img"); // single or double
        const isDouble = (type as HTMLImageElement)?.src?.includes(
          "d_text.png"
        );
        const isSingle = (type as HTMLImageElement)?.src?.includes(
          "s_text.png"
        );

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

        return { isDouble, isSingle, level, songName, score } as BestScore;
      })
    );
    await onLoadBestScore?.(data);

    await page.close();
    await browser.close();

    await onFinish?.();
  } catch (e) {
    await onError?.((e as any).message);
  }
}
