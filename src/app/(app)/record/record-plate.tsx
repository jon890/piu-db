import classnames from "@/client/utils/classnames";
import type { RecordPlate as RecordPlateDataType } from "@prisma/client";

type Props = {
  plate: RecordPlateDataType;
};

export default function RecordPlate({ plate }: Props) {
  return (
    <span
      className={classnames("plate font-semibold", {
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
