type Props = {
  title?: string | null;
  subTitle?: string | null;
  children?: React.ReactNode;
};

export default function ContentBox({ children, title, subTitle }: Props) {
  return (
    <section className="flex flex-col items-center w-full h-full gap-5 sm:gap-10 py-10 px-3">
      {title && <h1 className="text-xl sm:text-2xl font-bold">{title}</h1>}
      {subTitle && (
        <h2 className="text-lg sm:text-xl font-semibold">{subTitle}</h2>
      )}
      {children}
    </section>
  );
}
