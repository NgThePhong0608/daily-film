"use client";

import { useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addComment } from "@/app/actions/comments";
import Link from "next/link";
import { Loader2, Send } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Đang gửi...
        </>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" />
          Bình luận
        </>
      )}
    </Button>
  );
}

interface CommentFormProps {
  movieSlug: string;
}

export default function CommentForm({ movieSlug }: CommentFormProps) {
  const [username, setUsername] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const stored = localStorage.getItem("username");
    setUsername(stored);
  }, []);

  if (!mounted) return null;

  if (!username) {
    return (
      <div className="rounded-lg border bg-muted/50 p-4 text-center">
        <p className="text-sm text-muted-foreground mb-2">
          Bạn cần có tên người dùng để bình luận.
        </p>
        <Button asChild variant="outline" size="sm">
          <Link href="/welcome">Đặt tên ngay</Link>
        </Button>
      </div>
    );
  }

  async function clientAction(formData: FormData) {
    setError(null);
    const result = await addComment(null, formData);
    if (result?.error) {
      setError(result.error);
    } else {
      // Clear form on success - brute force via reset() or uncontrolled
      // Since we use logic, simpler to just reset the form element if possible
      // or rely on React key reset.
      // Let's use uncontrolled form resetting:
      const form = document.getElementById("comment-form") as HTMLFormElement;
      form?.reset();
    }
  }

  return (
    <form
      id="comment-form"
      action={clientAction}
      className="space-y-4"
    >
      <input type="hidden" name="movieSlug" value={movieSlug} />
      <input type="hidden" name="username" value={username} />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Bình luận dưới tên <span className="text-foreground font-semibold">{username}</span>
          </span>
        </div>
        <Textarea
          name="content"
          placeholder="Chia sẻ suy nghĩ của bạn về bộ phim..."
          className="min-h-[100px] resize-y"
          maxLength={500}
          required
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
