import Image from "next/image";
import Link from "next/link";

export default function HelpModal() {
  return (
    <>
      <dialog id="help_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">숙제방이 뭔가요?</h3>
          <p className="py-10">
            펌프잇업{" "}
            <strong className="font-semibold">
              최근 플레이기록을 활용하여
            </strong>{" "}
            유저들간에 숙제를 등록하고 기록을 비교할 수 있는 시스템입니다.
          </p>

          <h3 className="font-bold text-lg mt-16">
            펌프잇업 최근 플레이기록은 무엇인가요?
          </h3>
          <p className="py-10">
            <Link
              href="https://www.piugame.com/my_page/recently_played.php"
              target="_blank"
              className="link link-primary break-all"
            >
              https://www.piugame.com/my_page/recently_played.php
            </Link>
            <br />
            해당 페이지의 기록을 말합니다.
            <br />
            해당 페이지에서 완주한 기록{" "}
            <span className="text-xs font-light">( * 브렉오프 기록 포함) </span>
            을 불러와 숙제의 곡과 레벨에 맞는 기록을 읽고 자동으로
            등록해드립니다.
          </p>

          <div className="w-full aspect-square relative">
            <Image
              src="/images/help_recently_played.png"
              alt="help_recently_played"
              fill
              className="object-contain aspect-square"
            />
          </div>

          <div className="modal-action">
            <form method="dialog">
              {/* If there is a button in formn, it will close the modal */}
              <button className="btn">닫기</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
