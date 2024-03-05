"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { LoginSchema } from "./schema";

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
        code: "ParamError",
        message: "Missing Fields. Failed to Login User.",
      };
    }

    await signIn("credentials", validatedFields.data);
    return { code: "Success", message: "로그인 되었습니다" };
  } catch (error) {
    if (error instanceof AuthError) {
      return { code: error.type, message: error.name };
    } else {
      return { code: "Unknown", message: "알 수 없는 오류가 발생했습니다." };
    }
  }
}
