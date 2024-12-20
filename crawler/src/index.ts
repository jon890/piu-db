import * as functions from "@google-cloud/functions-framework";
import changeGameId from "./change-gameid";
import { CrawlingResponse } from "./common/crawling.response";
import { CrawlingException } from "./exception/crawling.exception";
import getMyBestScore from "./get-my-best-score";
import getRecentlyPlayed from "./get-recently-played";
import loadGameIds from "./load-gameid";
import getPumbilityRanking from "./puppeteer/get-pumbility-ranking";
import loginToPIU, { checkLoginState } from "./puppeteer/login-piu";
import { isBlank } from "./util";
import "dotenv/config";
import axios from "axios";
import getMyBestScoreFromApi from "./get-my-best-score-api";

functions.http("pumbility_ranking", async (req, res) => {
  const authToken = req.get("Authorization");

  if (authToken !== process.env.PUMBILITY_RANKING_AUTH_TOKEN) {
    res.status(401).send(CrawlingResponse.error("UNKNOWN", "인증 실패"));
    return;
  }

  try {
    const pumbilityRankingList = await getPumbilityRanking();
    res.send({ ok: true, pumbilityRankingList });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .send(CrawlingResponse.error("UNKNOWN", (e as Error).message));
  }
});

functions.http("crawling", async (req, res) => {
  // console.log("reqIp", req.ip);
  // console.log("reqReferrer", req.get("referrer"));

  const { email, password, nickname, mode } = req.body;

  try {
    if (isBlank(email)) throw new CrawlingException("EMAIL_REQUIRED");
    if (isBlank(password)) throw new CrawlingException("PASSWORD_REQUIRED");

    const { browser, cookies } = await loginToPIU({ email, password });
    await checkLoginState(browser);

    if (nickname) {
      await changeGameId(browser, nickname);

      if (mode === "MY_BEST") {
        const myBestScore = await getMyBestScoreFromApi(cookies);
        await browser.close();
        res.status(200).send(CrawlingResponse.ok(myBestScore));
      } else {
        const recentlyPlayed = await getRecentlyPlayed(browser);
        await browser.close();
        res.send({ recentlyPlayed });
      }
    } else {
      const gameIds = await loadGameIds(browser);

      await browser.close();
      res.send({ gameIds });
    }
  } catch (e) {
    console.log(e);

    if (e instanceof CrawlingException) {
      res
        .status(e.httpStatus)
        .send(CrawlingResponse.error(e.errorCode, e.message));
    } else {
      res
        .status(500)
        .send(CrawlingResponse.error("UNKNOWN", (e as Error).message));
    }
  }
});
