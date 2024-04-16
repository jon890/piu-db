"use client";

import classnames from "@/utils/classnames";
import { ButtonHTMLAttributes } from "react";
import { useFormStatus } from "react-dom";

type FormButtonProps = {
  text: string;
  loadingText?: string;
  disabled?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function FormButton({
  text,
  loadingText = "잠시만 기다려주세요...",
  disabled,
  className,
  ...rest
}: FormButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      className={classnames("btn btn-primary w-full max-w-md", className ?? "")}
      aria-disabled={disabled || pending}
      disabled={disabled || pending}
      {...rest}
    >
      {pending ? loadingText ?? text : text}
    </button>
  );
}
