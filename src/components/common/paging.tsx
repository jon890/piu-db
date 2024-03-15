"use client";

import classnames from "@/client/utils/classnames";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function Paging({
  page,
  count,
  unit,
}: {
  page: number;
  count: number;
  unit: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(count / unit);

  const handlePageMove = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("page", page.toString());
    router.push(pathname + "?" + newSearchParams.toString());
  };

  return (
    <div className="join">
      {Array(totalPages)
        .fill(null)
        .map((v, i) => (
          <button
            key={i}
            onClick={() => handlePageMove(i + 1)}
            className={classnames(
              "join-item btn",
              i + 1 === page ? "btn-active" : ""
            )}
          >
            {i + 1}
          </button>
        ))}
    </div>
  );
}
