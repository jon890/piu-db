import classnames from "@/utils/classnames";

type Props = {
  title?: string | null;
  subTitle?: string | null;
  children?: React.ReactNode;
  classname?: string;
};

export default function ContentBox({
  children,
  title,
  subTitle,
  classname,
}: Props) {
  return (
    <section
      className={classnames(
        "flex flex-col items-center w-full h-full gap-5 sm:gap-10 py-10 px-5",
        classname ?? ""
      )}
    >
      {title && <h1 className="text-xl sm:text-2xl font-bold">{title}</h1>}
      {subTitle && (
        <h2 className="text-lg sm:text-xl font-semibold">{subTitle}</h2>
      )}
      {children}
    </section>
  );
}
