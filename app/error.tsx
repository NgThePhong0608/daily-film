"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-2xl font-bold">Đã xảy ra lỗi!</h2>
      <p className="text-muted-foreground">
        Chúng tôi xin lỗi vì sự bất tiện này. Vui lòng thử lại.
      </p>
      <Button onClick={() => reset()}>Thử lại</Button>
    </div>
  );
}
