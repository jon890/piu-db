import ky from "ky";

export const client = ky.extend({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL,
});
