import { LoginParams } from "@/app/crawling/page";
import ky from "ky";

const client = ky;

export const loginToAmPass = (params: LoginParams) =>
  ky
    .post("api/crawling/login", {
      json: params,
    })
    .json();
