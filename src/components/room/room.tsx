import type { AssignmentRoom } from "@prisma/client";
import Link from "next/link";
import LockClosedIcon from "@heroicons/react/24/solid/LockClosedIcon";
import Tooltip from "../common/tooltip";

type Props = {
  room: AssignmentRoom & { admin: { nickname: string } };
  count: number;
};

export default function Room({ room, count }: Props) {
  return (
    <div className="card card-side w-full glass">
      {room.bannerImage && (
        <figure className="ml-4">
          <img
            src={room.bannerImage}
            alt="banner"
            className="size-20 rounded-xl object-cover"
          />
        </figure>
      )}

      <div className="card-body">
        <h2 className="card-title">
          <span>{room.name}</span>
          {room.stopParticipating && (
            <Tooltip text="일시적으로 참여가 제한되어있습니다">
              <LockClosedIcon className="size-6 text-superb" />
            </Tooltip>
          )}
        </h2>
        {room.description && <p className="font-medium">{room.description}</p>}
        <p className="text-end font-medium">
          방장 :{" "}
          <span className="font-semibold bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
            {room.admin.nickname}
          </span>
        </p>
        <p className="text-end font-medium">
          참여자 수 : <span className="font-semibold">{count}</span>
        </p>

        <div className="card-actions justify-end items-center gap-6">
          <Link
            href={`/rooms/${room.seq}`}
            className="btn btn-primary text-xs sm:text-sm"
          >
            상세 보기
          </Link>
        </div>
      </div>
    </div>
  );
}
