import type { Song } from "@prisma/client";

type Props = {
  song: Song;
};

export default function SongBadges({ song }: Props) {
  return (
    <div className="flex flex-row flex-wrap justify-end gap-2">
      <SongBadge text={`아티스트 : ${song.artist}`} />
      <SongBadge text={`타입 : ${song.songType}`} />
      <SongBadge text={`BPM : ${song.bpm}`} />
      <SongBadge text={`버전 : ${song.version}`} />
    </div>
  );
}

function SongBadge({ text }: { text: string }) {
  return (
    <div className="badge badge-lg badge-outline max-w-full justify-start !text-[10px] text-ellipsis whitespace-nowrap overflow-hidden">
      {text}
    </div>
  );
}
