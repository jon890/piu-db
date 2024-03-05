import classnames from "@/client/utils/classnames";
import Link from "next/link";

export async function Paging({
  basehref,
  page,
  count,
  unit,
}: {
  basehref: string;
  page: number;
  count: number;
  unit: number;
}) {
  console.log(page, count, unit);
  const totalPages = Math.ceil(count / unit);

  return (
    <div className="join">
      {Array(totalPages)
        .fill(null)
        .map((v, i) => (
          <Link href={`${basehref}?page=${i + 1}`} key={i}>
            <button
              className={classnames(
                "join-item btn",
                i + 1 === page ? "btn-active" : ""
              )}
            >
              {i + 1}
            </button>
          </Link>
        ))}
    </div>
  );
}
