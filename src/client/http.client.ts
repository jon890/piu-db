"use client";

import { LoginParams } from "@/app/crawling/page";
import ky from "ky";

const client = ky.extend({
  prefixUrl: "http://localhost:3000",
});

export const loginToAmPass = (params: LoginParams) =>
  client
    .post("api/crawling/login", {
      json: params,
    })
    .json();
