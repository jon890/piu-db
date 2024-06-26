"use client";

import { useState } from "react";

type Props<T extends string> = {
  values: T[];
  onSelect?: (value?: T) => void;
  resetBtnText?: string;
  btnText?: string;
  initialValue?: T;
};

export default function DropDown<T extends string>({
  values,
  onSelect,
  resetBtnText,
  btnText,
  initialValue,
}: Props<T>) {
  const [selected, setSelected] = useState<T | null>(initialValue ?? null);

  return (
    <div className="dropdown z-30">
      <div tabIndex={0} role="button" className="btn">
        {selected ?? btnText ?? "선택하기"}
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
      >
        <li
          onClick={() => {
            if (!selected) return;

            setSelected(null);
            onSelect?.();
          }}
        >
          <span>{resetBtnText ?? "초기화"}</span>
        </li>
        {values.map((v) => (
          <li
            onClick={() => {
              if (selected === v) return;

              setSelected(v);
              onSelect?.(v);
            }}
            key={v}
          >
            <span>{v}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
