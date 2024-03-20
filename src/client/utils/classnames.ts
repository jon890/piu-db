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

export const TEXT_ELLIPISIS = "overflow-hidden text-ellipsis whitespace-nowrap";
export const SONG_BADGE = classnames(
  "badge badge-xs sm:badge-sm md:badge-md lg:badge-lg badge-outline max-w-full justify-start !text-[10px]",
  TEXT_ELLIPISIS
);
