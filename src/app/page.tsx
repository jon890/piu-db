import Link from "next/link";

export default function Home() {
  return (
    <div className="container w-full h-screen flex justify-center items-center flex-col">
      <h1 className="text-3xl">Welcome to PIU DB</h1>

      <Link href="/auth/register" className="btn btn-primary mt-10">
        회원가입
      </Link>
    </div>
  );
}
