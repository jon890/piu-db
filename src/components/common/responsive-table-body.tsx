import classnames from "@/utils/classnames";

type Props = {
  children: (className: string) => React.ReactNode;
};

/**
 * tr에서 사용할 스타일 클래스를 제공해주는 table-body
 *
 * 동적 스타일 클래스를 넘겨주어 자식 컴포넌트를 렌더링한다
 * @param param0
 * @returns
 */
export default function ReponsiveTableBody({ children }: Props) {
  const className = classnames(
    "*:text-xs *:px-1 *:py-0.5",
    "*:sm:px-2 *:sm:py-1",
    "*:md:text-sm *:md:px-4 *:md:py-2",
    "*:text-center hover"
  );

  return <tbody>{children(className)}</tbody>;
}
