import Image from "next/image";

export type CardGlassProps = {
  image?: string;
  title?: string;
};

export default function CardGlass({ image, title }: CardGlassProps) {
  return (
    <div className="card card-side w-96 glass">
      {image && (
        <figure>
          <Image src={image} width={360} height={120} alt="card-image" />
        </figure>
      )}

      <div className="card-body">
        {title && <h2 className="card-title">{title}</h2>}

        <p>How to park your car at your garage?</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Learn now!</button>
        </div>
      </div>
    </div>
  );
}
