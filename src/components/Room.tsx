import { AssignmentRoom } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import phoenixChannel from "../../public/images/channel_purple.png";

export type RoomProps = { room: AssignmentRoom };

export default function CardGlass({ room }: RoomProps) {
  return (
    <div className="card card-side w-96 glass">
      {room.bannerImage && (
        <figure>
          <Image
            src={phoenixChannel}
            width={120}
            height={120}
            alt="card-image"
          />
        </figure>
      )}

      <div className="card-body">
        {room.name && <h2 className="card-title">{room.name}</h2>}
        {room.description && <p>{room.description}</p>}

        <div className="card-actions justify-end">
          <Link href={`/rooms/${room.seq}`}>
            <button className="btn btn-primary">상세 보기</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
