import { z } from "zod";

export type RegisterParam = {
  name: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
};

export const RegisterRequestSchema = z.object({
  name: z.string(),
  password: z.string().min(6),
  passwordConfirm: z.string().min(6),
  nickname: z.string(),
});
