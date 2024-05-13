import { ToastType } from "@/types/toast";
import { useCallback, useContext } from "react";
import ToastContext from "../context/toast.context";

export default function useToast() {
  const [toasts, setToasts] = useContext(ToastContext);

  const createToast = useCallback(
    (toast: ToastType) => {
      const key = toast.key ?? Math.random().toString();
      setToasts((prev) => [...prev, { ...toast, key }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.key !== key));
      }, 2500);
    },
    [toasts, setToasts]
  );

  const warning = useCallback(
    (message: string) => {
      createToast({ type: "warning", message });
    },
    [toasts, setToasts, createToast]
  );

  const error = useCallback(
    (message: string) => {
      createToast({ type: "error", message });
    },
    [toasts, setToasts, createToast]
  );

  const success = useCallback(
    (message: string) => {
      createToast({ type: "success", message });
    },
    [toasts, setToasts, createToast]
  );

  return { createToast, warning, error, success };
}
