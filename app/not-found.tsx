"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-4xl font-bold">404 - Không tìm thấy trang</h2>
      <p className="text-muted-foreground">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
      </p>
      <Link href="/">
        <Button>Về Trang Chủ</Button>
      </Link>
    </div>
  );
}
