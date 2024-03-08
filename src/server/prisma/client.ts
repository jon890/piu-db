import { PrismaClient } from "@prisma/client";
import { createCertificate } from "../utils/create-certificate";

// if (process.env.NODE_ENV === "production") {
//   console.log("createCertificate start");
//   createCertificate();
// }

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
