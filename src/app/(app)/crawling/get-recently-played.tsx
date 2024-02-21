"use client";

import { getRecentlyPlayed } from "@/server/action/get-recently-played";
import { PiuProfile } from "@prisma/client";
import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";

type GetRecentlyPlayedProps = {
  profile: PiuProfile;
  email: string;
  password: string;
};

export default function GetRecentlyPlayed({
  profile,
  email,
  password,
}: GetRecentlyPlayedProps) {
  const initialState = {
    ok: false,
    errors: undefined,
    message: undefined,
  };
  const [state, action] = useFormState(getRecentlyPlayed, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  console.log(state);

  useEffect(() => {
    formRef.current?.submit();
  }, []);

  return (
    <form action={action}>
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="password" value={password} />
      <input type="hidden" name="nickname" value={profile.gameId} />

      <h1>선택한 프로필</h1>
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">{profile.gameId}</h2>
          <p>{profile.lastPlayedCenter}</p>
          {profile.lastLoginDate && <p>{profile.lastLoginDate}</p>}

          <div className="card-actions justify-end">
            <button type="button" className="btn btn-primary">
              선택
            </button>
          </div>
        </div>
      </div>

      <button className="btn btn-primary">불러오기</button>

      <div className="overflow-x-auto w-full">
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>타입</th>
              <th>레벨</th>
              <th>곡명</th>
              <th>그레이드</th>
              <th>플레이트</th>
              <th>브렉온여부</th>
              <th>퍼펙트</th>
              <th>그레이트</th>
              <th>굿</th>
              <th>배드</th>
              <th>미스</th>
              <th>점수</th>
              <th>플레이시간</th>
            </tr>
          </thead>
          <tbody>
            {state?.data?.map((record, index) => (
              <tr key={record.playedTime}>
                <td>{index + 1}</td>
                <td>{record.type}</td>
                <td>{record.level}</td>
                <td>{record.songName}</td>
                <td>{record.grade}</td>
                <td>{record.plate}</td>
                <td>{record.isBreakOff}</td>
                <td>{record.perfect}</td>
                <td>{record.great}</td>
                <td>{record.good}</td>
                <td>{record.bad}</td>
                <td>{record.miss}</td>
                <td>{record.score}</td>
                <td>{record.playedTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </form>
  );
}
