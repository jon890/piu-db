import TimeUtil from "@/server/utils/time-util";
import { Notice } from "@prisma/client";

type Props = {
  notice: Notice;
  defaultChecked?: boolean;
};

export default function Notice({ notice, defaultChecked }: Props) {
  const contents = notice.contents.replaceAll("\n", "<br />");

  return (
    <div className="collapse collapse-arrow bg-base-200">
      <input type="radio" name="my-accordion-2" defaultChecked />
      <div className="collapse-title text-xl font-medium">{notice.title}</div>
      <div className="collapse-content">
        <p dangerouslySetInnerHTML={{ __html: contents }} />
        <p className="justify-items-end mt-3">
          작성일자 : {TimeUtil.format(notice.updatedAt, "YYYY-MM-DD HH:mm:ss")}
        </p>
      </div>
    </div>
  );
}
