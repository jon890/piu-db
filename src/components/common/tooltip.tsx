import { Children } from "react";

type Props = {
  children: React.ReactNode;
  text: string;
};

export default function Tooltip({ children, text }: Props) {
  return (
    <div className="tooltip" data-tip={text}>
      {children}
    </div>
  );
}
