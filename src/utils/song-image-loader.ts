"use client";

import { ImageLoaderProps } from "next/image";

export default function PiuImageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps) {
  return `${src}?w=${width}&q=${quality || 75}`;
}
