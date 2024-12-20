import { Browser, Page } from "puppeteer";
import { getPageWithNotImage } from "./puppeteer/ready-browser";
import { handleMultiplePages } from "./util";
import { Grade } from "./@types/grade";
import { Plate } from "./@types/plate";
import { MyBestScore } from "./@types/my-best-score";
import { ChartType } from "./@types/chart-type";
import os from "os";

/**
 * 마이 베스트 기록 가져오기
 * 로그인 된 페이지가 필요하다
 *
 * TODO 55페이지 동작시 62초 소요 개선이 필요해!!
 * => 전체 페이지를 병렬로 수행 => cloud run으로 배포 시 오류가 잦음 (페이지 로드 30초 초과)
 */
export default async function getMyBestScore(browser: Browser) {
  const URL = "https://www.piugame.com/my_page/my_best_score.php";
  const page = await getPageWithNotImage(browser);
  await page.goto(URL, { waitUntil: "domcontentloaded" });

  const noContents = await page.$("div.no_con");
  if (noContents) {
    return [];
  }

  const lastPage = await page.$eval(
    ".board_paging button.icon:last-child",
    (el) => {
      const onClickFunction = el.onclick?.toString() ?? null;
      if (!onClickFunction) return null;

      const href = onClickFunction?.substring(
        onClickFunction.indexOf("'") + 1,
        onClickFunction.lastIndexOf("'")
      );
      const [_, _lastPage] = href.split("=");
      return Number(_lastPage);
    }
  );

  const sessionId = Math.random().toString(36).substring(2, 15);
  console.debug("sessionId", sessionId, "getMyBestScore totalPage", lastPage);

  if (lastPage == null) {
    return [];
  }

  const unit = 20;
  const data: MyBestScore[] = [];
  const iterationCount = Math.floor(lastPage / unit);

  for (let i = 0; i <= iterationCount; i++) {
    console.debug(
      "sessionId",
      sessionId,
      "getMyBetScore memoryUsage",
      "totalMemory",
      (os.totalmem() / 1024 / 1024).toFixed(2) + "MB",
      "freeMemory",
      (os.freemem() / 1024 / 1024).toFixed(2) + "MB"
    );

    const result = await handleMultiplePages(
      browser,
      i !== iterationCount ? unit : lastPage % unit,
      (page, pageNumber) =>
        getMyBestScorePage(sessionId, page, unit * i + pageNumber)
    );
    data.push(...result);
  }

  return data;
}

async function getMyBestScorePage(
  sessionId: string,
  puppeteer: Page,
  pageNumber: number
) {
  console.debug(
    "sessionId",
    sessionId,
    "getMyBestScorePage pageNumber",
    pageNumber
  );
  const URL = `https://www.piugame.com/my_page/my_best_score.php?&page=${pageNumber}`;
  await puppeteer.goto(URL, { waitUntil: "domcontentloaded" });

  const data: MyBestScore[] = await puppeteer.$$eval(
    "ul.my_best_scoreList > li",
    (list) =>
      list.map((it) => {
        // Single or Double
        const typeEl = it.querySelector("div.tw img"); // single or double
        const typeSrc = (typeEl as HTMLImageElement)?.src ?? "";

        let type: ChartType;
        if (typeSrc.includes("s_text.png")) {
          type = "SINGLE";
        } else if (typeSrc.includes("d_text.png")) {
          type = "DOUBLE";
        } else {
          type = "Unknown";
        }

        // Level
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

        // Grade
        const gradeSrc =
          (it.querySelector("div.li_in img") as HTMLImageElement)?.src ?? "";
        let gradeFileName = gradeSrc.substring(gradeSrc.lastIndexOf("/") + 1); // aa.png

        gradeFileName = gradeFileName.substring(
          0,
          gradeFileName.lastIndexOf(".")
        ); // .png 제거

        const plus = gradeFileName.endsWith("_p");
        if (plus) {
          gradeFileName = gradeFileName.substring(
            0,
            gradeFileName.lastIndexOf("_")
          );
        }
        const grade = gradeFileName.toUpperCase() + (plus ? "_PLUS" : "");

        // Plate
        const plateSrc =
          (
            it.querySelector(
              "div.li_in > div.img.st1 > img"
            ) as HTMLImageElement
          )?.src ?? "";
        let plate: Plate = null;
        if (plateSrc.includes("rg.png")) {
          plate = "ROUGH_GAME";
        } else if (plateSrc.includes("fg.png")) {
          plate = "FAIR_GAME";
        } else if (plateSrc.includes("tg.png")) {
          plate = "TALENTED_GAME";
        } else if (plateSrc.includes("mg.png")) {
          plate = "MARVELOUS_GAME";
        } else if (plateSrc.includes("sg.png")) {
          plate = "SUPERB_GAME";
        } else if (plateSrc.includes("eg.png")) {
          plate = "EXTREME_GAME";
        } else if (plateSrc.includes("ug.png")) {
          plate = "ULTIMATE_GAME";
        } else if (plateSrc.includes("pg.png")) {
          plate = "PERFECT_GAME";
        }

        const songName = it.querySelector("div.song_name p")?.textContent ?? "";
        const score =
          it.querySelector("div.li_in > div.txt_v > span.num")?.textContent ??
          "";

        return {
          type,
          level,
          songName,
          grade: grade as Grade,
          plate: plate as Plate,
          score: score !== "" ? Number(score.replaceAll(",", "")) : 0,
        };
      })
  );
  return data;
}
