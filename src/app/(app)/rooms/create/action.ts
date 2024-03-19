"use server";

import RoomDB from "@/server/prisma/room.db";
import AuthUtil from "@/server/utils/auth-util";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CreateRoomSchema } from "./schema";

type State = {
  message?: string;
};

export async function createRoom(prevState: State | null, formData: FormData) {
  const validatedFields = CreateRoomSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    adminUserSeq: await AuthUtil.getUserSeqThrows(),
  });

  if (!validatedFields.success) {
    return {
      ok: false,
      errors: validatedFields.error.flatten(),
      message: "Missing Fields. Failed to Create Room.",
    };
  }

  await RoomDB.create(validatedFields.data);

  revalidatePath("/rooms");
  redirect("/rooms");
}
