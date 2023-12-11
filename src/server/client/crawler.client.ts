import _ky from "ky";

const ky = _ky.extend({ headers: { "Content-Type": "application/json" } });

function getGameIds(email: string, password: string) {
  return ky.post(process.env.CRAWLER_URL ?? "", {
    timeout: false,
    headers: {
      "content-type": "application/json",
      asjdfioadjsfio: "asjdiflojafio",
    },
    json: {
      email,
      password,
    },
    hooks: {
      beforeRequest: [
        (request) => {
          request.headers.set("content-type", "application/json");
          console.log(request.headers);
          return request;
        },
      ],
    },
  });
}

export default {
  getGameIds,
};
