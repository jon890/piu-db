import Link from "next/link";

export default async function Home() {
  return (
    <div className="w-full h-screen flex justify-center items-center flex-col p-10">
      <div className="my-auto flex flex-col gap-4 text-center">
        <h1 className="text-xl sm:text-2xl font-bold">
          PIU DB에 오신것을 환영합니다
        </h1>
        <p className="text-lg sm:text-xl font-medium">
          사이트의 모든 기능을 이용하려면 <br />
          먼저 로그인해주세요
        </p>
      </div>

      <div className="flex flex-col w-full max-w-xs gap-5">
        <Link href="/auth/login" className="btn btn-secondary">
          로그인
        </Link>

        <Link href="/auth/register" className="btn btn-primary">
          회원가입
        </Link>

        <Link href="/auth/find" className="btn btn-neutral">
          아이디/비밀번호 찾기
        </Link>
      </div>
    </div>
  );
}
