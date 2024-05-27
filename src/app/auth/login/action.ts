"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { LOGIN_CODE, LoginSchema } from "./schema";
import { isRedirectError } from "next/dist/client/components/redirect";
import logger from "@/server/client/logger.client";

type State = {
  code: string;
  message: string;
};

export async function authenticate(
  prevState: State | null,
  formData: FormData
) {
  try {
    const validatedFields = LoginSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten(),
        code: LOGIN_CODE.PARAM_ERROR,
        message: "입력되지 않은 항목이 있습니다. 확인해주세요",
      };
    }

    await signIn("credentials", validatedFields.data);
    return { code: LOGIN_CODE.SUCCESS, message: "로그인 되었습니다" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof AuthError) {
      return { code: error.type, message: error.name };
    } else {
      logger.error(error);
      return { code: "Unknown", message: "알 수 없는 오류가 발생했습니다." };
    }
  }
}
