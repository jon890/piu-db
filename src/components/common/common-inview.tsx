import InViewHelper from "./in-view-helper";

export default function CommonInView({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <InViewHelper
      anyClass="transition duration-1000 opacity-0"
      inClass="opacity-100"
      outClass="translate-y-[1rem]"
    >
      {children}
    </InViewHelper>
  );
}
