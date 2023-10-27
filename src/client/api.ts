"use client";

import ky from "ky";

const client = ky.extend({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL,
});

export const loginToAmPass = (params: { email: string; password: string }) =>
  client
    .post("api/crawling/login", {
      timeout: false,
      json: params,
    })
    .json();
