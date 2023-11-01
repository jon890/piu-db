import { NextAuthConfig } from "next-auth";

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
      const isOnHome = nextUrl.pathname.startsWith("/dashboard");

      console.log("auth:", auth);
      console.log("isLoggedIn:", isLoggedIn, "isOnHome:", isOnHome);

      if (isOnHome) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        console.log("authorized check:", nextUrl.toString());
        return Response.redirect(new URL("/", nextUrl));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;

// TODO satisfies 연구
