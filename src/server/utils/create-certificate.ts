import fs from "fs";

// nextjs dev server reloads files on page navigation, so new Prisma Clients were being spawned everytime
export function createCertificate() {
  const clientIdentity = process.env.SSL_IDENTITY ?? "";
  const decodeIdentity = Buffer.from(clientIdentity, "base64");
  fs.writeFileSync(`/tmp/client-identity.p12`, decodeIdentity);
  fs.writeFileSync(`/tmp/server-ca.pem`, process.env.SSL_CERT ?? "");
}
