"use client";

import { $Enums, Chart, PiuVersion, Song } from "@prisma/client";
import { MouseEventHandler, useState } from "react";

type Props = {
  songs: Song[];
  charts: Chart[];
};

export default function SelectSong({ songs, charts }: Props) {
  const version = $Enums.PiuVersion;

  const [selectedVersion, setSelectedVersion] = useState<PiuVersion | null>(
    null
  );

  return (
    <div className="flex gap-5 flex-col">
      <details className="dropdown">
        <summary className="m-1 btn">버전 선택하기</summary>
        <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
          {Object.values(version).map((v) => (
            <li onClick={() => setSelectedVersion(v)} key={v}>
              <span>{v}</span>
            </li>
          ))}
        </ul>
      </details>

      <div className="card lg:card-side bg-base-100 shadow-xl">
        <figure></figure>
        <div className="card-body">
          <h2 className="card-title gap-2">
            <span>선택한 버전</span>
            <span>:</span>
            <span>{selectedVersion}</span>
          </h2>
          <p>
            <span>곡 제목</span>
            <span>:</span>
            <span></span>
          </p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">선택완료</button>
          </div>
        </div>
      </div>
    </div>
  );
}
