import { cookies } from "next/headers";
import CryptService from "../crypt/crypt.service";

const PIU_AUTH_COOKIE_NAME = "_PUMPITUPAUTH";

function hasPiuAuth() {
  const cookieStore = cookies();
  return Boolean(cookieStore.get(PIU_AUTH_COOKIE_NAME));
}

async function getPiuAuthValue() {
  if (!hasPiuAuth()) {
    return null;
  }

  const value = cookies().get(PIU_AUTH_COOKIE_NAME)?.value ?? "";
  const decrypted = await CryptService.decrypt(value);
  return JSON.parse(decrypted);
}

const CookieUtil = {
  PIU_AUTH_COOKIE_NAME,
  hasPiuAuth,
  getPiuAuthValue,
};

export default CookieUtil;
