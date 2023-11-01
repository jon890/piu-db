import { NextAuthConfig } from "next-auth";

const protectedRoute = ["/rooms"];

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
      const isProtected = !!protectedRoute.find((it) =>
        nextUrl.pathname.startsWith(it)
      );

      // console.log("auth:", auth);
      // console.log("isLoggedIn:", isLoggedIn, "isProtected:", isProtected);

      if (isProtected) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        // console.log("authorized check:", nextUrl.toString());
        return Response.redirect(new URL("/rooms", nextUrl));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;

// TODO satisfies 연구
