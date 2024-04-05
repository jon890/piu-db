import classnames from "@/client/utils/classnames";
import Link from "next/link";

type Props = {
  targetLevel?: number;
};

export default function SelectLevel({ targetLevel }: Props) {
  return (
    <div className="flex flex-row justify-center items-center gap-3 flex-wrap">
      {Array(28)
        .fill(null)
        .map((v, i) => i + 1)
        .map((level) => (
          <Link href={`/records/level/${level}`} key={level}>
            <div
              className={classnames(
                "flex size-20 rounded-md bg-base-200 justify-center items-center",
                "hover:bg-gray-500 active:bg-gray-500 transition-colors",
                targetLevel === level ? "bg-gray-500" : ""
              )}
            >
              <span>LEVEL {level}</span>
            </div>
          </Link>
        ))}
    </div>
  );
}
