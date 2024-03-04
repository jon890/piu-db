"use client";

import { useFormStatus } from "react-dom";

interface FormButtonProps {
  text: string;
  loadingText?: string;
}

export default function FormButton({
  text,
  loadingText = "잠시만 기다려주세요...",
}: FormButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      className="btn btn-primary w-full max-w-md mt-5"
      aria-disabled={pending}
      disabled={pending}
    >
      {pending ? loadingText ?? text : text}
    </button>
  );
}
