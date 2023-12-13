"use client";

import { PiuProfile } from "@prisma/client";

type GetRecentlyPlayedProps = {
  profile: PiuProfile;
};

export default function GetRecentlyPlayed({ profile }: GetRecentlyPlayedProps) {
  return (
    <>
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
    </>
  );
}
