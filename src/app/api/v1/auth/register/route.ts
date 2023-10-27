import { RegisterRequestSchema } from "@/app/auth/register/register-param";
import prisma from "@/server/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import BaseApiResponse from "./dto/BaseApiResponse";

/**
 * 회원가입
 * @param request
 */
export async function POST(request: NextRequest) {
  const body = await request.json();

  const { name, nickname, password, passwordConfirm } =
    RegisterRequestSchema.parse(body);

  const exist = await prisma.user.findUnique({
    where: {
      name,
    },
  });

  if (exist) {
    return NextResponse.json(BaseApiResponse.error("이미 가입된 유저입니다"));
  }

  const newUser = await prisma.user.create({
    data: {
      name,
      nickname,
      password,
    },
  });

  return NextResponse.json(
    BaseApiResponse.ok("유저가 생성되었습니다", newUser)
  );
}
