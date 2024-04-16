"use client";

import classnames from "@/utils/classnames";
import { ReactNode } from "react";
import { InView } from "react-intersection-observer";

export default function InViewHelper({
  children,
  anyClass,
  inClass,
  outClass,
}: {
  children: ReactNode;
  anyClass?: string;
  inClass?: string;
  outClass?: string;
}) {
  return (
    <InView triggerOnce={false} threshold={0.5}>
      {({ inView, ref, entry }) => (
        <div
          ref={ref}
          className={classnames(
            anyClass ?? "",
            inView ? inClass ?? "" : outClass ?? ""
          )}
        >
          {children}
        </div>
      )}
    </InView>
  );
}
