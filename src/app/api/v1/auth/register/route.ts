import prisma from "@/server/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import BaseApiResponse from "./dto/BaseApiResponse";

const RegisterRequestSchema = z.object({
  name: z.string(),
  password: z.string().min(6),
  nickname: z.string(),
});

/**
 * 회원가입
 * @param request
 */
export async function POST(request: NextRequest) {
  const body = await request.json();

  const registerRequest = RegisterRequestSchema.parse(body);

  const exist = await prisma.user.findUnique({
    where: {
      name: registerRequest.name,
    },
  });

  if (exist) {
    return NextResponse.json(BaseApiResponse.error("이미 가입된 유저입니다"));
  }

  const newUser = await prisma.user.create({
    data: {
      name: registerRequest.name,
      nickname: registerRequest.nickname,
      password: registerRequest.password,
    },
  });

  return NextResponse.json(
    BaseApiResponse.ok("유저가 생성되었습니다", newUser)
  );
}
