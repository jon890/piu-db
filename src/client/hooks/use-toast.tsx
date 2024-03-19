import { useCallback, useContext } from "react";
import ToastContext from "../context/toast.context";
import { ToastType } from "@/types/toast";

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

  return { createToast };
}
