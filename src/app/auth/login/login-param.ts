import { z } from "zod";

export type LoginParam = {
  name: string;
  password: string;
};

export const LoginParamSchema = z.object({
  name: z.string(),
  password: z.string().min(6),
});
