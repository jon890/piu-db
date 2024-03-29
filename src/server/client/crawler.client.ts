import { RecentlyPlayed } from "@/types/recently-played";
import _ky, { HTTPError } from "ky";
import "server-only";

const ky = _ky.extend({ headers: { "Content-Type": "application/json" } });

function getGameIds(email: string, password: string) {
  return ky.post(process.env.CRAWLER_URL ?? "", {
    timeout: false,
    json: {
      email,
      password,
    },
  });
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
    let errorMsg: string;
    if (e instanceof HTTPError) {
      const errorBody = await e.response.json();
      errorMsg = errorBody;
    } else {
      errorMsg = (e as Error).message;
    }

    return { ok: false, error: errorMsg };
  }
}

const CrawlerClient = {
  getGameIds,
  getRecentlyPlayed,
};

export default CrawlerClient;
