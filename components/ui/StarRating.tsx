"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { rateMovie } from "@/app/actions/ratings";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface StarRatingProps {
  movieSlug: string;
  initialUserRating: number | null;
  username: string | null;
}

export default function StarRating({ movieSlug, initialUserRating, username }: StarRatingProps) {
  const [rating, setRating] = useState(initialUserRating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  // Sync hydration
  useState(() => {
    setMounted(true);
  });

  if (!mounted) return <div className="h-8 w-32 bg-muted/20 animate-pulse rounded" />;

  if (!username) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex gap-1" title="Đăng nhập để đánh giá">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className="w-6 h-6 text-muted-foreground/30 cursor-not-allowed"
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          <Link href="/welcome" className="underline hover:text-primary">
            Đặt tên
          </Link>{" "}
          để đánh giá
        </p>
      </div>
    );
  }

  const handleRate = (stars: number) => {
    if (isPending) return;

    // Optimistic update
    setRating(stars);

    startTransition(async () => {
      const result = await rateMovie(movieSlug, username, stars);
      if (result.error) {
        // Revert on error
        setRating(initialUserRating || 0);
        alert(result.error);
      }
    });
  };

  return (
    <div className="flex items-center gap-3">
      <div
        className="flex gap-1"
        onMouseLeave={() => setHoverRating(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={isPending}
            className={cn(
              "transition-all duration-200 hover:scale-110 focus:outline-none",
              isPending && "opacity-50 cursor-wait"
            )}
            onMouseEnter={() => setHoverRating(star)}
            onClick={() => handleRate(star)}
          >
            <Star
              className={cn(
                "w-6 h-6 transition-colors",
                (hoverRating || rating) >= star
                  ? "fill-yellow-500 text-yellow-500"
                  : "fill-transparent text-muted-foreground"
              )}
            />
          </button>
        ))}
      </div>
      {isPending && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
    </div>
  );
}
