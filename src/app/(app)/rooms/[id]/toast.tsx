"use client";

import { useEffect, useState } from "react";

type ToastProps = {
  message: string;
};

export default function Toast({ message }: ToastProps) {
  const [t, setT] = useState<string | null>(message);

  useEffect(() => {
    setTimeout(() => {
      setT(null);
    }, 2000);

    // console.log("onMount");
  }, []);

  return (
    t && (
      <div className="toast toast-bottom toast-center">
        <div className="alert alert-info">
          <span>{t}</span>
        </div>
      </div>
    )
  );
}
