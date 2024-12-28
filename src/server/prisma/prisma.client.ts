import { PrismaClient } from "@prisma/client";
import logger from "../client/logger.client";

const prisma = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "stdout",
      level: "error",
    },
    {
      emit: "stdout",
      level: "info",
    },
    {
      emit: "stdout",
      level: "warn",
    },
  ],
});

prisma.$on("query", (e) => {
  const isSlow = e.duration > 1000;
  const isDev = process.env.NODE_ENV === "development";

  if (e.query === "BEGIN") return;
  if (e.query === "DEALLOCATE ALL") return;
  if (e.query === "COMMIT") return;

  if (isDev || isSlow) {
    logger.info(`
    Query: ${e.query}
    Params: ${e.params}
    Duration: ${e.duration}ms
    `);
  }
});

export default prisma;
