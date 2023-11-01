import Link from "next/link";
import { auth } from "../auth";

export default async function Home() {
  return (
    <div className="container w-full h-screen flex justify-center items-center flex-col">
      <h1 className="text-3xl font-bold">PIU DB에 오신것을 환영합니다</h1>
      <p className="mt-4">
        사이트의 모든 기능을 이용하려면 먼저 로그인해주세요
      </p>

      <Link
        href="/auth/login"
        className="btn btn-secondary mt-10 w-full max-w-xs"
      >
        로그인
      </Link>

      <Link
        href="/auth/register"
        className="btn btn-primary mt-10 w-full max-w-xs"
      >
        회원가입
      </Link>
    </div>
  );
}
