import { auth } from "@/auth";
import logger from "@/server/client/logger.client";
import { refreshCache } from "@/server/prisma/_init";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth();
  const id = session?.user?.name;

  if (!id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (id !== "bifos") {
    return NextResponse.json({ error: "Not permitted" }, { status: 403 });
  }

  await refreshCache();
  logger.info("Cache refreshed!! by", id);

  return NextResponse.json({ message: "success" }, { status: 200 });
}
