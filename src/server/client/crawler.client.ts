import type { GameId } from "@/types/game-id";
import type { MyBestScore } from "@/types/my-best-score";
import type { PiuAuth } from "@/types/piu-auth";
import type { RecentlyPlayed } from "@/types/recently-played";
import _ky, { HTTPError } from "ky";
import "server-only";
import logger from "./logger.client";

const ky = _ky.extend({ headers: { "Content-Type": "application/json" } });

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

async function getGameIds(
  email: string,
  password: string
): Promise<{ ok: true; data: GameId[] } | { ok: false; error: string }> {
  try {
    const resBody = await ky
      .post(process.env.CRAWLER_URL ?? "", {
        timeout: false,
        json: {
          email,
          password,
        },
      })
      .json<{ gameIds: GameId[] }>();

    return { ok: true, data: resBody.gameIds };
  } catch (e) {
    return _handleKyException(e);
  }
}

async function getRecentlyPlayed(
  email: string,
  password: string,
  nickname: string
): Promise<
  { ok: true; data: RecentlyPlayed[] } | { ok: false; error: string }
> {
  try {
    const resBody = await ky
      .post(process.env.CRAWLER_URL ?? "", {
        timeout: false,
        json: {
          email,
          password,
          nickname,
        },
      })
      .json<{ recentlyPlayed: RecentlyPlayed[] }>();

    return { ok: true, data: resBody.recentlyPlayed };
  } catch (e) {
    return _handleKyException(e);
  }
}

async function getMyBestScores(
  auth: PiuAuth,
  nickname: string
): Promise<{ ok: true; data: MyBestScore[] } | { ok: false; error: string }> {
  try {
    const resBody = await ky
      .post(process.env.CRAWLER_URL ?? "", {
        timeout: false,
        json: {
          email: auth.email,
          password: auth.password,
          nickname,
          mode: "MY_BEST",
        },
      })
      .json<{ data: MyBestScore[]; message?: string }>();

    return { ok: true, data: resBody.data };
  } catch (e) {
    return _handleKyException(e);
  }
}

const CrawlerClient = {
  getGameIds,
  getRecentlyPlayed,
  getMyBestScores,
};

export default CrawlerClient;
