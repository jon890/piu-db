import classnames from "@/client/utils/classnames";
import { InputHTMLAttributes, RefObject } from "react";

type InputWithLabelProps = {
  topLeft?: string;
  topRight?: string;
  topRightClass?: string;
  errors?: string[];
  inputRef?: RefObject<HTMLInputElement>;
} & InputHTMLAttributes<HTMLInputElement>;

export default function InputWithLabel({
  name,
  topLeft,
  topRight,
  topRightClass,
  errors,
  inputRef,
  ...rest
}: InputWithLabelProps) {
  return (
    <div className="form-control w-full max-w-md">
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
        className="input input-bordered w-full max-w-md"
        aria-describedby={`${name ?? ""}-error`}
        ref={inputRef}
        {...rest}
      />
      <label className="label">
        {/* <span className="label-text-alt">Bottom Left label</span>
        <span className="label-text-alt">Bottom Left label</span> */}
      </label>
      {errors && (
        <div
          id={`${name ?? ""}-error`}
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
