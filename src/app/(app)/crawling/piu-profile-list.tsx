"use client";

import { getPiuProfiles } from "@/server/action/get-piu-profiles";
import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";

export default function PiuProfileList() {
  const initialState = { profiles: [] };
  const [state, formAction] = useFormState(getPiuProfiles, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    formRef?.current?.requestSubmit();
  }, []);

  return (
    <form
      action={formAction}
      ref={formRef}
      className="grid sm:grid-cols-1 md:grid-cols-2 gap-5"
    >
      {state?.profiles.length === 0 ? (
        <h1>데이터가 없습니다</h1>
      ) : (
        state?.profiles.map((profile) => (
          <div className="card w-96 bg-base-100 shadow-xl" key={profile.seq}>
            <figure>
              <img
                src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
                alt="Shoes"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{profile.gameId}</h2>
              <p>{profile.lastPlayedCenter}</p>
              {profile.lastLoginDate && <p>{profile.lastLoginDate}</p>}

              <div className="card-actions justify-end">
                <button className="btn btn-primary">선택</button>
              </div>
            </div>
          </div>
        ))
      )}
    </form>
  );
}
