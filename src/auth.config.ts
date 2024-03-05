import { NextAuthConfig } from "next-auth";

const AUTH_ROUTE = ["/auth/login", "/auth/register", "/"];
const PUBLIC_ROUTES = [...AUTH_ROUTE];

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
      const isPublic = !!PUBLIC_ROUTES.find((it) =>
        nextUrl.pathname.startsWith(it)
      );
      const isAuth = !!AUTH_ROUTE.find((it) => nextUrl.pathname.startsWith(it));

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
} satisfies NextAuthConfig;

// TODO satisfies 연구
