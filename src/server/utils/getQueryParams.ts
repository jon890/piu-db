export default function getQueryParmas(url: string): Record<string, string> {
  const hasQuery = url.indexOf("?") > -1;

  if (!hasQuery) return {};

  const queryStr = url.substring(url.indexOf("?") + 1);
  const params = queryStr.split("&");
  const ret: Record<string, string> = {};
  for (const p of params) {
    const [k, v] = p.split("=");
    ret[k] = v;
  }
  return ret;
}
