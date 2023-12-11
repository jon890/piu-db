import ky from "ky";

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
