import ContentBox from "@/components/layout/content-box";
import Link from "next/link";

export default function Loading() {
  return (
    <ContentBox title="숙제방 목록">
      <Link href="/rooms/create" className="btn btn-primary text-xs sm:text-sm">
        숙제방 생성
      </Link>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-5 w-full">
        {[...Array(10)].map((v, i) => (
          <div className="skeleton w-full h-32" key={i}></div>
        ))}
      </div>
    </ContentBox>
  );
}
