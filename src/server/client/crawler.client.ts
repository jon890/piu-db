import "server-only";
import _ky from "ky";

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

function getRecentlyPlayed(email: string, password: string, nickname: string) {
  return ky.post(process.env.CRAWLER_URL ?? "", {
    timeout: false,
    json: {
      email,
      password,
      nickname,
    },
  });
}

const index = {
  getGameIds,
  getRecentlyPlayed,
};

export default index;
