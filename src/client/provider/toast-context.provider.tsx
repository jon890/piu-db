"use client";

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import ToastContext from "../context/toast.context";
import { createPortal } from "react-dom";
import type { ToastType } from "@/types/toast";
import Toast from "@/components/toast";

type Props = {
  children: React.ReactNode;
};

export default function ToastContextProvier({ children }: Props) {
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const data: [ToastType[], Dispatch<SetStateAction<ToastType[]>>] = useMemo(
    () => [toasts, setToasts],
    [toasts]
  );

  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setContainer(document.getElementById("toast-container"));
  }, []);

  return (
    <ToastContext.Provider value={data}>
      {children}
      {container &&
        createPortal(
          <div className="toast toast-top toast-end">
            {toasts.map((toast, index) => (
              <Toast key={toast.key} toast={toast} />
            ))}
          </div>,
          container
        )}
    </ToastContext.Provider>
  );
}
