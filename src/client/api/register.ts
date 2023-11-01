import { RegisterParam } from "@/app/auth/register/register-param";
import { client } from "./api-client";
import BaseApiResponse from "@/server/dto/BaseApiResponse";

export const register = (params: RegisterParam) =>
  client
    .post("/api/v1/auth/register", {
      json: params,
    })
    .json<BaseApiResponse<unknown, unknown>>();
