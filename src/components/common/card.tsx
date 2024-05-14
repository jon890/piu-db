import classnames from "@/utils/classnames";

type Props = {
  title: string;
  children: React.ReactNode;
  classname?: string;
};

export default function Card({ children, title, classname }: Props) {
  return (
    <div className={classnames("card bg-base-100 shadow-xl", classname ?? "")}>
      <div className="card-body p-4 sm:p-8">
        <h2 className="card-title text-lg sm:text-xl">{title}</h2>
        {children}
      </div>
    </div>
  );
}
