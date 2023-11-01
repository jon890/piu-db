import { UseFormRegisterReturn } from "react-hook-form";

type InputWithLabelProps = {
  name?: string;
  type?: "text" | "password";
  topLeft?: string;
  placeholder?: string;
  register?: UseFormRegisterReturn;

  [key: string]: unknown;
};

export default function InputWithLabel({
  name,
  type,
  topLeft,
  placeholder,
  register,
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
        {...register}
        {...rest}
      />
      <label className="label">
        {/* <span className="label-text-alt">Bottom Left label</span>
        <span className="label-text-alt">Bottom Left label</span> */}
      </label>
    </div>
  );
}
