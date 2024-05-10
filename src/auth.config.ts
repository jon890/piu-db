import { NextAuthConfig } from "next-auth";

// TODO /auth/* 로 수정할 수 있을지 고민
const AUTH_ROUTE = ["/auth/login", "/auth/register", "/auth/find"];
const PUBLIC_ROUTES = [...AUTH_ROUTE, "/"];

/**
 * NextAuth Config
 */
export const authConfig = {
  providers: [],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isPublic = PUBLIC_ROUTES.includes(nextUrl.pathname);
      const isAuth = AUTH_ROUTE.includes(nextUrl.pathname);

      if (isPublic) {
        if (isAuth && isLoggedIn) {
          return Response.redirect(new URL("/rooms", nextUrl));
        }

        return true;
      } else {
        if (isLoggedIn) {
          return true;
        }

        return false;
      }
    },
  },
  session: {
    maxAge: 86400 * 7,
    updateAge: 86400,
  },
} satisfies NextAuthConfig;

// TODO satisfies 연구
