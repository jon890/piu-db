"use client";

import { getRecentlyPlayedAction } from "@/app/(app)/piu-login/(get-recently-played)/action";
import FormButton from "@/components/FormButton";
import { PiuProfile } from "@prisma/client";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";

type Props = {
  profile: PiuProfile;
  email: string;
  password: string;
};

export default function GetRecentlyPlayed({ profile, email, password }: Props) {
  const [state, action] = useFormState(getRecentlyPlayedAction, null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (state?.data?.length) {
      setLoaded(true);
    }
  }, [state?.data]);

  return (
    <form
      action={action}
      className="flex flex-col gap-10 justify-center items-center w-full"
    >
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="password" value={password} />
      <input type="hidden" name="nickname" value={profile.gameId} />

      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">{profile.gameId}</h2>
          <p>{profile.lastPlayedCenter}</p>
          {profile.lastLoginDate && <p>{profile.lastLoginDate}</p>}
        </div>
      </div>

      <FormButton text="최근기록 불러오기" className="mt-5" />

      <div className="overflow-x-auto w-full">
        <table className="table table-xs">
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
              <tr key={record.playedTime} className="hover">
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
