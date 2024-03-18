import crypto from "node:crypto";

const MASTER_KEY = process.env.MASTER_KEY;

if (!MASTER_KEY) {
  throw Error("CryptService: Env에 MasterKey가 없습니다!");
}

const IV_LENGTH = 16;
const SALT_LENGTH = 64;

async function encrypt(text: string) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const salt = crypto.randomBytes(SALT_LENGTH);

  // derive encryption key: 32 byte key length
  // in assumption the masterkey is a cryptographic and NOT a password there is no need for
  // a large number of iterations. It may can replaced by HKDF
  // the value of 2145 is randomly chosen!
  const key = crypto.pbkdf2Sync(MASTER_KEY!, salt, 2145, 32, "sha512");

  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  const encrypted = Buffer.concat([
    cipher.update(text, "utf-8"),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return Buffer.concat([salt, iv, tag, encrypted]).toString("base64");
}

async function decrypt(encrypted: string) {
  const bData = Buffer.from(encrypted, "base64");

  const salt = bData.subarray(0, SALT_LENGTH);
  const iv = bData.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const tag = bData.subarray(
    SALT_LENGTH + IV_LENGTH,
    SALT_LENGTH + IV_LENGTH + 16
  );
  const text = bData.subarray(SALT_LENGTH + IV_LENGTH + 16);

  const key = crypto.pbkdf2Sync(MASTER_KEY!, salt, 2145, 32, "sha512");

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);

  const decrypted =
    decipher.update(text, undefined, "utf-8") + decipher.final("utf-8");

  return decrypted;
}

const CryptService = {
  encrypt,
  decrypt,
};

export default CryptService;
