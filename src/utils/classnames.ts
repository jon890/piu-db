export default function classnames(
  ...classnames: (string | Record<string, boolean>)[]
) {
  const v = classnames
    .filter((it) => {
      if (typeof it === "string") {
        return it !== "";
      }
      return true;
    })
    .map((it) => {
      // console.log(typeof it)
      if (typeof it === "string") {
        return it;
      } else if (typeof it === "object") {
        return Object.entries(it)
          .filter(([_, check]) => check)
          .map(([key]) => key)
          .join(" ");
      }
    })
    .filter((it) => it)
    .join(" ");

  return v;
}
