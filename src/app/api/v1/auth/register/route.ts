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

  const { name, nickname, password } = RegisterRequestSchema.parse(body);

  const exist = await prisma.user.findMany({
    where: {
      OR: [{ name }, { nickname }],
    },
  });

  if (exist.length) {
    return NextResponse.json(
      BaseApiResponse.error("아이디와 닉네임은 중복될 수 없습니다")
    );
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
