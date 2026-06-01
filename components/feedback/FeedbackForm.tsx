"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Send } from "lucide-react";

import { submitFeedback } from "@/app/actions/feedback";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Đang gửi
        </>
      ) : (
        <>
          <Send className="h-4 w-4" />
          Gửi phản hồi
        </>
      )}
    </Button>
  );
}

export default function FeedbackForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function formAction(formData: FormData) {
    setError(null);
    setSuccess(null);
    formData.set("username", window.localStorage.getItem("username") ?? "");
    formData.set("pagePath", window.location.pathname);

    const result = await submitFeedback(null, formData);

    if (result?.error) {
      setError(result.error);
      return;
    }

    const form = document.getElementById("feedback-form") as HTMLFormElement | null;
    form?.reset();
    setSuccess("Cảm ơn bạn. Phản hồi đã được gửi.");
  }

  return (
    <form
      id="feedback-form"
      action={formAction}
      className="space-y-3"
    >
      <div className="space-y-2">
        <label htmlFor="feedback-type" className="mb-1.5 block text-sm font-medium">
          Loại phản hồi
        </label>
        <select
          id="feedback-type"
          name="type"
          defaultValue="idea"
          className="flex h-8 w-full rounded-md border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="idea">Ý tưởng cải thiện</option>
          <option value="bug">Lỗi trải nghiệm</option>
          <option value="design">Giao diện</option>
          <option value="content">Nội dung phim</option>
          <option value="other">Khác</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="feedback-message" className="mb-1.5 block text-sm font-medium">
          Bạn muốn website cải thiện điều gì?
        </label>
        <Textarea
          id="feedback-message"
          name="message"
          required
          minLength={10}
          maxLength={1000}
          placeholder="Ví dụ: phần tìm kiếm nên nhanh hơn, cần thêm bộ lọc, player trên mobile hơi khó dùng..."
          className="min-h-20 resize-y px-2.5 py-1.5"
        />
      </div>

      <div className="flex justify-end">
        <SubmitButton />
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-400">{success}</p> : null}
    </form>
  );
}
