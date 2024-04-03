import ArrowLeftIcon from "@heroicons/react/24/solid/ArrowLeftIcon";
import Link from "next/link";

type Props = {
  title: string;
};

export default function AuthTopBar({ title }: Props) {
  return (
    <div className="flex flex-row items-center w-full max-w-md mb-10">
      <Link href="/">
        <ArrowLeftIcon className="size-6" />
      </Link>

      <h1 className="text-3xl font-bold mx-auto">{title}</h1>
    </div>
  );
}
