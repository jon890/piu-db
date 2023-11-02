type InputWithLabelProps = {
  name?: string;
  type?: "text" | "password";
  topLeft?: string;
  placeholder?: string;
  errors?: string[];

  [key: string]: unknown;
};

export default function InputWithLabel({
  name,
  type,
  topLeft,
  placeholder,
  errors,
  ...rest
}: InputWithLabelProps) {
  return (
    <div className="form-control w-full max-w-md">
      <label className="label">
        {topLeft && <span className="label-text">{topLeft}</span>}
        {/* <span className="label-text-alt">Top Right Label</span> */}
      </label>
      <input
        type={type ?? "text"}
        name={name ?? ""}
        placeholder={placeholder ?? ""}
        className="input input-bordered w-full max-w-md"
        aria-describedby={`${name}-error`}
        {...rest}
      />
      <label className="label">
        {/* <span className="label-text-alt">Bottom Left label</span>
        <span className="label-text-alt">Bottom Left label</span> */}
      </label>
      {errors && (
        <div
          id={`${name}-error`}
          aria-live="polite"
          className="text-sm text-red-500"
        >
          {errors.map((error: string) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      )}
    </div>
  );
}
