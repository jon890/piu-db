import fs from "fs";
import os from "os";

// nextjs dev server reloads files on page navigation, so new Prisma Clients were being spawned everytime
export function createCertificate() {
  const tmpDir = os.hostname() === "kbt.local" ? "/Users/nhn" : os.tmpdir();
  const clientIdentity = process.env.SSL_IDENTITY ?? "";
  const decodeIdentity = Buffer.from(clientIdentity, "base64");
  fs.writeFileSync(`${tmpDir}/client-identity.p12`, decodeIdentity);
  fs.writeFileSync(`${tmpDir}/server-ca.pem`, process.env.SSL_CERT ?? "");
}
