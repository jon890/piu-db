import fs from "fs";
import os from "os";
import { TMP_DIR } from "./tmpdir";

// nextjs dev server reloads files on page navigation, so new Prisma Clients were being spawned everytime
export function createCertificate() {
  const clientIdentity = process.env.SSL_IDENTITY ?? "";
  const decodeIdentity = Buffer.from(clientIdentity, "base64");
  fs.writeFileSync(`${TMP_DIR}/client-identity.p12`, decodeIdentity);
  fs.writeFileSync(`${TMP_DIR}/server-ca.pem`, process.env.SSL_CERT ?? "");
}
