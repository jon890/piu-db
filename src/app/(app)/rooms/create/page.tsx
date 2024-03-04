import CreateRoomForm from "./form";

/**
 * 숙제방 생성 페이지
 * @returns
 */
export default function CreateRoomPage() {
  return (
    <main className="w-full">
      <section className="w-full flex justify-center flex-col items-center">
        <h1 className="text-3xl font-bold mb-10 mt-10">방 생성</h1>

        <CreateRoomForm />
        <p className="mt-10">✅ 초기 방장은 방 개설자로 셋팅됩니다.</p>
      </section>
    </main>
  );
}
