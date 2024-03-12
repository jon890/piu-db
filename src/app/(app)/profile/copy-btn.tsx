"use client";

type Props = {
  text: string;
};

export default function CopyButton({ text }: Props) {
  function handleCopy() {
    window.navigator.clipboard.writeText(text);
    alert("UID가 복사되었습니다! 친구에게 공유해보세요");
  }

  return (
    <button type="button" className="btn btn-primary" onClick={handleCopy}>
      복사
    </button>
  );
}
