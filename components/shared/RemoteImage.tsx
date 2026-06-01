"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type RemoteImageProps = ImageProps;

export default function RemoteImage({
  alt,
  src,
  onError,
  ...props
}: RemoteImageProps) {
  const [failedOptimizedSrc, setFailedOptimizedSrc] = useState<string | null>(null);
  const normalizedSrc = typeof src === "string" ? src : src.toString();
  const useUnoptimized = failedOptimizedSrc === normalizedSrc;

  return (
    <Image
      alt={alt}
      {...props}
      src={src}
      unoptimized={useUnoptimized}
      onError={(event) => {
        if (!useUnoptimized) {
          setFailedOptimizedSrc(normalizedSrc);
        }

        onError?.(event);
      }}
    />
  );
}
