"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="w-screen h-screen flex justify-center items-center flex-col gap-10">
      <h2>존재하지 않는 경로입니다</h2>
      <button className="btn btn-primary" onClick={() => router.back()}>
        뒤로 돌아가기
      </button>
    </div>
  );
}
