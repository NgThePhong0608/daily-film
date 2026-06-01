"use client";

import { useEffect, useState } from "react";
import StarRating from "@/components/ui/StarRating";
import { getUserMovieRating } from "@/app/actions/ratings";

interface InteractiveRatingProps {
  movieSlug: string;
}

export default function InteractiveRating({ movieSlug }: InteractiveRatingProps) {
  const [username, setUsername] = useState<string | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUsername(storedUser);

    if (storedUser) {
      getUserMovieRating(movieSlug, storedUser)
        .then((rating) => {
          setUserRating(rating);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [movieSlug]);

  if (loading) {
    return <div className="h-6 w-32 bg-muted/20 animate-pulse rounded" />;
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-muted-foreground uppercase font-semibold">
        Đánh giá của bạn
      </span>
      <StarRating
        movieSlug={movieSlug}
        initialUserRating={userRating}
        username={username}
      />
    </div>
  );
}
