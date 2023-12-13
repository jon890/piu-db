"use client";

import { getPiuProfiles } from "@/server/action/get-piu-profiles";
import { PiuProfile } from "@prisma/client";
import { useEffect, useState } from "react";

type PiuProfileListProps = {
  onSelect?: (profile: PiuProfile) => void | Promise<void>;
};

export default function PiuProfileList({ onSelect }: PiuProfileListProps) {
  const [profiles, setProfiles] = useState<PiuProfile[]>([]);

  useEffect(() => {
    const getProfiles = async () => {
      const dbProfiles = await getPiuProfiles();
      setProfiles(dbProfiles.profiles);
    };

    getProfiles();
  }, []);

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-5">
      {profiles.length === 0 ? (
        <h1>데이터가 없습니다</h1>
      ) : (
        profiles.map((profile) => (
          <div className="card w-96 bg-base-100 shadow-xl" key={profile.seq}>
            {/* <figure>
              <img
                src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
                alt="Shoes"
              />
            </figure> */}
            <div className="card-body">
              <h2 className="card-title">{profile.gameId}</h2>
              <p>{profile.lastPlayedCenter}</p>
              {profile.lastLoginDate && <p>{profile.lastLoginDate}</p>}

              <div className="card-actions justify-end">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => onSelect?.(profile)}
                >
                  선택
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
