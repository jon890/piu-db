import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/rooms">Return Home</Link>
    </div>
  );
}
