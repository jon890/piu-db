import NextAuth from "next-auth";
import { NextRequest } from "next/server";
import { authConfig } from "../auth.config";

export function middleware(request: NextRequest) {
  console.log("middleware");
  return NextAuth(authConfig).auth;
}

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|.png).*)"],
};
