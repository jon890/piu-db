import { RegisterParam } from "@/app/auth/register/register-param";
import { client } from "./api-client";
import BaseApiResponse from "@/app/api/v1/auth/register/dto/BaseApiResponse";

export const register = (params: RegisterParam) =>
  client
    .post("/api/v1/auth/register", {
      json: params,
    })
    .json<BaseApiResponse<unknown, unknown>>();
