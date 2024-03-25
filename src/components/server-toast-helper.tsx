"use client";

import { signOut } from "@/auth";
import useToast from "@/client/hooks/use-toast";
import { signout } from "@/server/action/sign-out.action";
import { ToastType } from "@/types/toast";
import { useEffect } from "react";

type Props = {
  toast: ToastType;
  action?: "SIGN_OUT";
};

export default function ServerToastHelper({ toast, action }: Props) {
  const { createToast } = useToast();

  useEffect(() => {
    createToast(toast);
  }, []);

  useEffect(() => {
    if (action === "SIGN_OUT") {
      signout();
    }
  }, [action]);

  return null;
}
