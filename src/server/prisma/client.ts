import { PrismaClient } from "@prisma/client";
import { createCertificate } from "../utils/create-certificate";

if (process.env.NODE_ENV === "production") {
  createCertificate();
}

// console.log("db connection", process.env.POSTGRES_PRISMA_URL);

const prisma = new PrismaClient({
  log: [
    {
      emit: "stdout",
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

export default prisma;
