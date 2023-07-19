export default function classnames(...classes: string[]) {
  return classes.filter((it) => it !== "").join(" ");
}
