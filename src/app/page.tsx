import Link from "next/link";

export default function Home() {
  return (
    <div className="container w-full h-screen flex justify-center items-center flex-col">
      <h1 className="text-3xl">Welcome to PIU DB</h1>

      <Link href="/crawling/" className="btn btn-primary mt-10">
        데이터 크롤링 하러 가기
      </Link>
    </div>
  );
}
