export default function RoomListSkeleton() {
  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-5 w-full">
      {[...Array(10)].map((_, i) => (
        <div className="skeleton w-full h-48" key={i}></div>
      ))}
    </div>
  );
}
