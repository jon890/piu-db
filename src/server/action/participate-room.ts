"use server";

import { auth } from "@/auth";
import prisma from "@/server/prisma/client";
import { z } from "zod";

export type ParticipateRoomState = {
  errors?: {
    roomSeq?: string[];
    userSeq?: string[];
  };
  message?: string;
};

const participateRoomSchema = z.object({
  roomSeq: z.coerce.number().gt(0, "참여 정보가 잘못되었습니다"),
  userSeq: z.coerce.number().gt(0, "유저 정보가 잘못되었습니다"),
});

export async function participateRoom(
  prevState: ParticipateRoomState,
  formData: FormData
): Promise<ParticipateRoomState> {
  const session = await auth();
  const maybeUserSeq = session?.user?.email;

  const validatedFields = participateRoomSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    userSeq: maybeUserSeq,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "참여 정보가 잘못되었습니다",
    };
  }

  const { roomSeq, userSeq } = validatedFields.data;

  const exist = await prisma.assignmentRoomParticipants.findUnique({
    where: {
      assignmentRoomSeq_userSeq: {
        assignmentRoomSeq: roomSeq,
        userSeq,
      },
    },
  });

  if (exist) {
    return {
      errors: {},
      message: "이미 참여중입니다.",
    };
  }
  const user = await prisma.assignmentRoomParticipants.create({
    data: {
      assignmentRoomSeq: roomSeq,
      userSeq,
    },
  });

  return { errors: undefined, message: "참여되었습니다~!" };
  // redirect(`/rooms/${roomSeq}`);
}
