"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Lock, Loader2 } from "lucide-react";

import { loginAdmin } from "@/app/actions/feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full sm:flex-1" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Đang kiểm tra
        </>
      ) : (
        "Đăng nhập admin"
      )}
    </Button>
  );
}

export default function AdminFeedbackGate() {
  const [state, formAction] = useActionState(loginAdmin, null);

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md items-center">
      <div className="w-full rounded-3xl border bg-card p-8 shadow-sm">
        <div className="mb-6 space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border bg-background">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-semibold">Admin Feedback</h1>
          <p className="text-sm text-muted-foreground">
            Nhập mật khẩu admin để xem phản hồi người dùng.
          </p>
        </div>

        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Mật khẩu
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Admin feedback password"
            />
          </div>

          {state && "error" in state ? (
            <p className="text-sm text-destructive">{state.error}</p>
          ) : null}

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild variant="outline" className="w-full sm:flex-1">
              <Link href="/">Quay lại trang phim</Link>
            </Button>
            <LoginButton />
          </div>
        </form>
      </div>
    </div>
  );
}
