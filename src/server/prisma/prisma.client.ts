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
  logger.info("Query: " + e.query);
  logger.info("Params: " + e.params);
  logger.info("Duration: " + e.duration + "ms");
});

export default prisma;
