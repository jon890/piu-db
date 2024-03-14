"use client";

import useToast from "@/client/hooks/use-toast";
import { ToastType } from "@/types/toast";
import { useEffect } from "react";

type Props = {
  toast: ToastType;
};

export default function ServerToastHelper({ toast }: Props) {
  const { createToast } = useToast();

  useEffect(() => {
    createToast(toast);
  }, []);

  return null;
}
