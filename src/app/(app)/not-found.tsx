import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-screen h-screen flex justify-center items-center flex-col gap-10">
      <h2>존재하지 않는 경로입니다</h2>
      <Link href="/rooms" className="btn btn-primary">
        홈으로 돌아가기
      </Link>
    </div>
  );
}
