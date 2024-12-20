import axios from "axios";
import { Cookie } from "puppeteer";
import * as cheerio from "cheerio";
import { Grade } from "./@types/grade";
import { Plate } from "./@types/plate";
import { MyBestScore } from "./@types/my-best-score";
import { ChartType } from "./@types/chart-type";

/**
 * 퍼펫티어로 로그인 후
 * 해당 세션 쿠키를 이용하여
 * 페이지를 직접 호출하여 데이터만 불러온다.
 */
export default async function getMyBestScoreFromApi(cookies: Cookie[]) {
  const firstPageResponse = await axios.get(
    "https://www.piugame.com/my_page/my_best_score.php?&&page=1",
    {
      headers: {
        Cookie: cookies.map((it) => `${it.name}=${it.value}`).join("; "),
      },
    }
  );

  const sessionId = Math.random().toString(36).substring(2, 15);

  const { records: firstPageRecords, totalCount } = parseMyBestScore(
    firstPageResponse.data
  );
  const pageCount = Math.ceil(totalCount / 12);
  console.debug(
    "sessionId",
    sessionId,
    "getMyBestScoreFromApi pageCount",
    pageCount
  );

  // 청크 사이즈 설정 (한 번에 5개 페이지씩 처리)
  const chunkSize = 10;
  const allRecords = [...firstPageRecords];

  // 페이지를 청크 단위로 나누어 처리
  for (let i = 2; i <= pageCount; i += chunkSize) {
    const pagePromises = [];
    const end = Math.min(i + chunkSize - 1, pageCount);

    for (let page = i; page <= end; page++) {
      pagePromises.push(getMyBestScorePage(sessionId, cookies, page));
    }

    const chunkResults = await Promise.allSettled(pagePromises);
    const chunkRecords = chunkResults
      .filter(
        (
          r
        ): r is PromiseFulfilledResult<{
          records: MyBestScore[];
          totalCount: number;
        }> => r.status === "fulfilled"
      )
      .map((r) => r.value.records)
      .flat();

    allRecords.push(...chunkRecords);
  }

  return allRecords;
}

async function getMyBestScorePage(
  sessionId: string,
  cookies: Cookie[],
  pageNumber: number
) {
  console.debug(
    "sessionId",
    sessionId,
    "getMyBestScorePage pageNumber",
    pageNumber
  );
  const URL = `https://www.piugame.com/my_page/my_best_score.php?&&page=${pageNumber}`;
  console.debug(
    "sessionId",
    sessionId,
    "getMyBestScorePage request! pageNumber",
    pageNumber
  );
  const response = await axios.get(URL, {
    headers: {
      Cookie: cookies.map((it) => `${it.name}=${it.value}`).join("; "),
    },
  });
  console.debug(
    "sessionId",
    sessionId,
    "getMyBestScorePage response! pageNumber",
    pageNumber
  );
  const parsed = parseMyBestScore(response.data);
  console.debug(
    "sessionId",
    sessionId,
    "getMyBestScorePage parsed! pageNumber",
    pageNumber
  );
  return parsed;
}

function parseMyBestScore(html: string) {
  const startIndex = html.indexOf(`<div class="subDoc">`);
  const endIndex = html.indexOf(`<div class="page_search">`, startIndex);

  const normalizedHtml =
    html.substring(startIndex, endIndex) + "</div></div></div>";

  // console.log("parseMyBestScore normalizedHtml", normalizedHtml);
  const $ = cheerio.load(normalizedHtml);

  const totalCount = $("div.board_search div.total_wrap i.t2")
    .text()
    .replaceAll(",", "");

  const records = $("ul.my_best_scoreList > li")
    .toArray()
    .map((li) => {
      // Single or Double
      const typeSrc = $(li).find("div.tw img").attr("src") ?? "";

      let type: ChartType;
      if (typeSrc.includes("s_text.png")) {
        type = "SINGLE";
      } else if (typeSrc.includes("d_text.png")) {
        type = "DOUBLE";
      } else {
        type = "Unknown";
      }

      // Level
      const level = $(li)
        .find("div.numw div.imG img")
        .toArray()
        .map((it) => {
          const img = $(it);
          const src = img.attr("src") ?? "";
          const splits = src.split("/");
          const png = splits[splits.length - 1];
          const [ball] = png.split(".");
          const ballSplits = ball.split("_");
          return ballSplits[ballSplits.length - 1];
        })
        .join("");

      // Grade
      const gradeSrc = $(li).find("div.li_in img").attr("src") ?? "";
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
        $(li).find("div.li_in > div.img.st1 > img").attr("src") ?? "";
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

      const songName = $(li).find("div.song_name p").text() ?? "";
      const score = $(li).find("div.li_in > div.txt_v > span.num").text() ?? "";

      return {
        type,
        level,
        songName,
        grade: grade as Grade,
        plate: plate as Plate,
        score: score !== "" ? Number(score.replaceAll(",", "")) : 0,
      };
    });

  return { records, totalCount: Number(totalCount) };
}
