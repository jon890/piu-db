import piuProfileDb from "@/server/prisma/piu-profile-db";
import GetGameIdForm from "./get-game-id-form";
import { auth } from "@/auth";

export default function CrawlingPage() {
  return (
    <div className="flex flex-col items-center justify-start w-full h-full space-y-10">
      <h1 className="text-3xl mt-10">펌프잇업 로그인</h1>
      <GetGameIdForm />
      <PiuProfileList />
    </div>
  );
}

async function PiuProfileList() {
  const session = await auth();
  const maybeUserSeq = session?.user?.email;

  if (!maybeUserSeq) return null;
  const profiles = await piuProfileDb.getPiuProfiles(Number(maybeUserSeq));

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-5">
      {profiles.map((profile) => (
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
            <div className="card-actions justify-end">
              <button className="btn btn-primary">
                {profile.lastLoginDate}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
