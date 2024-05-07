type Props = {
  title: string;
  children: React.ReactNode;
};

export default function Card({ children, title }: Props) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        {children}
      </div>
    </div>
  );
}
