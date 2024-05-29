"use client";

import classnames from "@/utils/classnames";
import { ButtonHTMLAttributes } from "react";

type Props = {
  text: string;
  loading: boolean;
  loadingText?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function ButtonWithLoading({
  text,
  loadingText = "잠시만 기다려주세요...",
  className,
  loading,
  onClick,
}: Props) {
  return (
    <button
      onClick={(e) => onClick?.(e)}
      className={classnames("btn text-xs sm:text-sm", className ?? "")}
      disabled={loading}
      aria-disabled={loading}
    >
      {loading ? (
        <>
          <span className="loading loading-spinner"></span>
          {loadingText}
        </>
      ) : (
        text
      )}
    </button>
  );
}
