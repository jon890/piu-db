import GetGameIdForm from "./get-game-id-form";

export default function CrawlingPage() {
  return (
    <div className="flex flex-col items-center justify-start w-full h-full space-y-10">
      <h1 className="text-3xl mt-10">펌프잇업 로그인</h1>
      <GetGameIdForm />
    </div>
  );
}
