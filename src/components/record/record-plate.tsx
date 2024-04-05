import classnames from "@/client/utils/classnames";
import type { RecordPlate as RecordPlateDataType } from "@prisma/client";

type Props = {
  plate: RecordPlateDataType;
  className?: string;
};

export default function RecordPlate({ plate, className }: Props) {
  return (
    <span
      className={classnames("plate font-semibold", className ?? "", {
        "text-rough": plate === "ROUGH_GAME" || plate === "FAIR_GAME",

        "text-talented":
          plate === "TALENTED_GAME" || plate === "MARVELOUS_GAME",

        "text-superb": plate === "SUPERB_GAME" || plate === "EXTREME_GAME",

        "text-ultimate": plate === "ULTIMATE_GAME" || plate === "PERFECT_GAME",
      })}
    >
      {plate}
    </span>
  );
}
