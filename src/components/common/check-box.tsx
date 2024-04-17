import classnames from "@/utils/classnames";
import { InputHTMLAttributes } from "react";

type Props = {
  errors?: string[];
  topLeft?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function CheckBox({
  errors,
  name,
  topLeft,
  disabled,
  defaultChecked,
}: Props) {
  return (
    <div className="form-control w-full max-w-md">
      <label className={classnames("label", !disabled ? "cursor-pointer" : "")}>
        {topLeft && <span className="label-text">{topLeft}</span>}

        <input
          type="checkbox"
          name={name ?? ""}
          className="checkbox checkbox-primary"
          disabled={disabled}
          defaultChecked={defaultChecked}
        />
      </label>
      {errors && (
        <div
          id={`${name ?? ""}-error`}
          aria-live="polite"
          className="text-sm text-red-500 font-semibold text-center mt-1"
        >
          {errors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      )}
    </div>
  );
}
