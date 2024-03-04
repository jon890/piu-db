import { initializeCache } from "./server/prisma/init";

export async function register() {
  console.log("instrumentation register");
  initializeCache();
}
