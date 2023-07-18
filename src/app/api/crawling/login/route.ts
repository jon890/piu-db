import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const reqBody = await request.json();

  return NextResponse.json({ successful: true });
}
