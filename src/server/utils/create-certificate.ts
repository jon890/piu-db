import fs from "fs";
import os from "os";

console.log("tmpDir", os.tmpdir());
console.log("process.env", process.env.NODE_ENV);

// nextjs dev server reloads files on page navigation, so new Prisma Clients were being spawned everytime
export function createCertificate() {
  const clientIdentity = process.env.SSL_IDENTITY ?? "";
  const decodeIdentity = Buffer.from(clientIdentity, "base64");
  fs.writeFileSync(`${os.tmpdir()}/client-identity.p12`, decodeIdentity);
  fs.writeFileSync(`${os.tmpdir()}/server-ca.pem`, process.env.SSL_CERT ?? "");
}
