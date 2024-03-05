import Link from "next/link";

export default async function Home() {
  return (
    <div className="w-full h-screen flex justify-center items-center flex-col p-10">
      <h1 className="text-2xl md:text-3xl font-bold">
        PIU DB에 오신것을 환영합니다
      </h1>
      <p className="mt-4 text-xl font-medium">
        사이트의 모든 기능을 이용하려면 <br />
        먼저 로그인해주세요
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
