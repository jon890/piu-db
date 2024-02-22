"use client";

import { getRecentlyPlayedAction } from "@/server/action/get-recently-played.action";
import { PiuProfile } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

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
  const [state, action] = useFormState(getRecentlyPlayedAction, initialState);
  const [loaded, setLoaded] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.data?.length) {
      setLoaded(true);
    }
  }, [state.data]);

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

      <SubmitButton disabled={loaded} />

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

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="btn btn-primary w-full max-w-md mt-5"
      type="submit"
      aria-disabled={pending || disabled}
      disabled={pending || disabled}
    >
      {pending
        ? "최근기록을 불러오고 있습니다.. 잠시만 기다려 주세요"
        : "최근기록 불러오기"}
    </button>
  );
}
