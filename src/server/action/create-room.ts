"use server";

import { auth } from "@/auth";
import prisma from "@/server/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export type State = {
  errors?: {
    name?: string[];
    description?: string[];
    bannerIamge?: string[];
  };
  message?: string | null;
};

const createRoomSchema = z.object({
  name: z.string().min(1, "방 이름을 입력해주세요"),
  description: z.string(),
  adminUserSeq: z.number().gt(0),
  bannerImage: z.string(),
});

export async function createRoom(prevState: State, formData: FormData) {
  const session = await auth();
  const userSeq = session?.user?.email;

  const validatedFields = createRoomSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    adminUserSeq: userSeq ? Number(userSeq) : null,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Room.",
    };
  }

  const { adminUserSeq, bannerImage, description, name } = validatedFields.data;
  const room = await prisma.assignmentRoom.create({
    data: {
      name,
      adminUserSeq,
      bannerImage,
      description,
    },
  });

  revalidatePath("/rooms");
  redirect("/rooms");
}
