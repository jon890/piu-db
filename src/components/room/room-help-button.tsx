"use client";

export default function RoomHelpButton() {
  return (
    <button
      className="btn btn-info text-xs sm:text-sm"
      onClick={() => {
        // @ts-ignore
        document.getElementById("help_modal")?.showModal();
      }}
    >
      숙제방이 뭔가요?
    </button>
  );
}
