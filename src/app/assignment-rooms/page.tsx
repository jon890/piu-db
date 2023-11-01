import CardGlass from "@/components/CardGlass";
import Link from "next/link";

export default function AssignmentRoomsPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full space-y-10">
      <h1 className="text-3xl mt-10">목록</h1>
      <Link href="/assignment-rooms/create">
        <button className="btn btn-primary">생성</button>
      </Link>

      <div className="grid grid-cols-2 gap-5">
        <CardGlass
          title="방1"
          image="https://burst.shopifycdn.com/photos/city-lights-through-rain-window.jpg"
        />
        <CardGlass
          title="방1"
          image="https://burst.shopifycdn.com/photos/city-lights-through-rain-window.jpg"
        />
        <CardGlass
          title="방1"
          image="https://burst.shopifycdn.com/photos/city-lights-through-rain-window.jpg"
        />
      </div>
    </div>
  );
}
