"use server";

import MessageDB from "@/server/prisma/message.db";
import { revalidatePath } from "next/cache";

export async function readMessageAction(messageSeq: number) {
  await MessageDB.readMessage(messageSeq);
  revalidatePath("/", "layout");
}
