export default function sleep(millseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, millseconds));
}
