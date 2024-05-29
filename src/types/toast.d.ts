export type ToastLevel = "info" | "success" | "warning" | "error";

export type ToastType = {
  key?: string;
  message: string;
  type: ToastLevel;
};
