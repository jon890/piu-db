import type { ToastType } from "@/types/toast";
import { Dispatch, SetStateAction, createContext } from "react";

const ToastContext = createContext<
  [ToastType[], Dispatch<SetStateAction<ToastType[]>>]
>([[], () => {}]);

export default ToastContext;
