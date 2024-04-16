import classnames from "@/utils/classnames";
import { InputHTMLAttributes, LegacyRef } from "react";

type InputWithLabelProps = {
  topLeft?: string;
  topRight?: string;
  topRightClass?: string;
  errors?: string[];
  inputRef?: LegacyRef<HTMLInputElement> | undefined;
  wrapperClassName?: string;
  initialValue?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function InputWithLabel({
  name,
  topLeft,
  topRight,
  topRightClass,
  errors,
  inputRef,
  wrapperClassName,
  ...rest
}: InputWithLabelProps) {
  return (
    <div
      className={classnames(
        "form-control w-full max-w-md",
        wrapperClassName ?? ""
      )}
    >
      <label className="label">
        {(topLeft || topRight) && (
          <span className="label-text">{topLeft ?? ""}</span>
        )}
        {topRight && (
          <span className={classnames("label-text-alt", topRightClass ?? "")}>
            {topRight}
          </span>
        )}
      </label>
      <input
        name={name ?? ""}
        className={classnames("input input-bordered w-full max-w-md", {
          "border-red-500": errors != null && errors.length > 0,
        })}
        aria-describedby={`${name ?? ""}-error`}
        ref={inputRef}
        {...rest}
      />

      {errors && (
        <div
          id={`${name ?? ""}-error`}
          aria-live="polite"
          className="text-sm text-red-500 font-semibold text-center mt-1"
        >
          {errors.map((error: string) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      )}
    </div>
  );
}
