import { PumbilityRankingDatum } from "@/types/pumbility-ranking-datum";
import _ky, { HTTPError } from "ky";
import logger from "./logger.client";

const ky = _ky.extend({
  headers: {
    "Content-Type": "application/json",
    Authorization: process.env.PUMBILITY_RANKING_AUTH_TOKEN ?? "",
  },
});

async function _handleKyException(
  e: unknown
): Promise<{ ok: false; error: string }> {
  let errorMsg: string;
  if (e instanceof HTTPError && e.response.status === 400) {
    logger.error(e);

    const errorBody = await e.response.json();
    if (errorBody?.message && errorBody?.error) {
      errorMsg = `${errorBody.error}: ${errorBody.message}`;
    } else {
      errorMsg =
        "에러가 발생했습니다. 계속해서 발생하면 관리자에게 문의해주세요";
    }
  } else {
    errorMsg = (e as Error).message;
  }

  return { ok: false, error: errorMsg };
}

async function getPumbilityRanking(): Promise<
  { ok: true; data: PumbilityRankingDatum[] } | { ok: false; error: string }
> {
  try {
    const resBody = await ky
      .post(process.env.PUMBILITY_CRAWLER_URL ?? "", {
        timeout: false,
      })
      .json<{ ok: true; pumbilityRankingList: PumbilityRankingDatum[] }>();

    return { ok: true, data: resBody.pumbilityRankingList };
  } catch (e) {
    return _handleKyException(e);
  }
}

const PumbilityCrawlerClient = {
  getPumbilityRanking,
};

export default PumbilityCrawlerClient;
