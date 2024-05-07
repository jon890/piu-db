"use client";

import classnames from "@/utils/classnames";
import { InputHTMLAttributes } from "react";

type Props = {
  errors?: string[];
  topLeft?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function CheckBox({
  errors,
  topLeft,
  disabled,
  ...rest
}: Props) {
  return (
    <div className="form-control w-full max-w-md">
      <label className={classnames("label", !disabled ? "cursor-pointer" : "")}>
        {topLeft && <span className="label-text">{topLeft}</span>}

        <input
          type="checkbox"
          className="checkbox checkbox-primary"
          disabled={disabled}
          {...rest}
        />
      </label>
      {errors && (
        <div
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
