"use client";

export default function HelpButton() {
  return (
    <button
      className="btn btn-info text-xs sm:text-sm"
      onClick={() => {
        console.log("click", document.getElementById("help_modal"));
        // @ts-ignore
        document.getElementById("help_modal")?.showModal();
      }}
    >
      숙제방이 뭔가요?
    </button>
  );
}
