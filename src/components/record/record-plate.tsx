import classnames from "@/utils/classnames";
import type { RecordPlate as RecordPlateDataType } from "@prisma/client";

type Props = {
  plate: RecordPlateDataType;
  className?: string;
};

export default function RecordPlate({ plate, className }: Props) {
  return (
    <span
      className={classnames("plate font-semibold", className ?? "", {
        "text-rough after:content-['RG'] md:after:content-['ROUGH']":
          plate === "ROUGH_GAME",
        "text-rough after:content-['FG'] md:after:content-['FAIR']":
          plate === "FAIR_GAME",
        "text-talented dark:text-gray-800 after:content-['TG'] md:after:content-['TALENTED']":
          plate === "TALENTED_GAME",
        "text-talented dark:text-gray-800 after:content-['MG'] md:after:content-['MARVELOUS']":
          plate === "MARVELOUS_GAME",
        "text-superb after:content-['SG'] md:after:content-['SUPERB']":
          plate === "SUPERB_GAME",
        "text-superb after:content-['EG'] md:after:content-['EXTREME']":
          plate === "EXTREME_GAME",
        "text-ultimate after:content-['UG'] md:after:content-['ULTIMATE']":
          plate === "ULTIMATE_GAME",
        "text-ultimate after:content-['PG'] md:after:content-['PERFECT']":
          plate === "PERFECT_GAME",
      })}
    ></span>
  );
}
