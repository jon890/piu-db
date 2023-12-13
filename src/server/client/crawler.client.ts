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

export default {
  getGameIds,
};
