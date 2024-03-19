import { AssignmentRoom } from "@prisma/client";
import Link from "next/link";

export type RoomProps = { room: AssignmentRoom; count: number };

export default function CardGlass({ room, count }: RoomProps) {
  return (
    <div className="card card-side w-full glass">
      {room.bannerImage && (
        <figure className="ml-4">
          <img
            src={room.bannerImage}
            alt="banner"
            className="size-20 rounded-xl"
          />
        </figure>
      )}

      <div className="card-body">
        <h2 className="card-title">{room.name}</h2>
        {room.description && <p className="font-medium">{room.description}</p>}
        <p className="text-end font-medium">
          참여자 수 : <span className="font-bold">{count}</span>
        </p>

        <div className="card-actions justify-end">
          <Link href={`/rooms/${room.seq}`}>
            <button className="btn btn-primary">상세 보기</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
