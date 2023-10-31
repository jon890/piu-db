import Link from "next/link";

export default function Home() {
  return (
    <div className="container w-full h-screen flex justify-center items-center flex-col">
      <h1 className="text-3xl">Welcome to PIU DB</h1>

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
