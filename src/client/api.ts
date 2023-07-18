"use client";

import { LoginParams } from "@/app/crawling/page";
import ky from "ky";
import { Protocol } from "puppeteer";

const client = ky.extend({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL,
});

export const loginToAmPass = (params: LoginParams) =>
  client
    .post("api/crawling/login", {
      json: params,
    })
    .json();

export const loadRecordFromPIU = (cookies: Protocol.Network.Cookie[]) =>
  client
    .post("api/crawling/best-score", {
      json: {
        cookies,
      },
    })
    .json();
