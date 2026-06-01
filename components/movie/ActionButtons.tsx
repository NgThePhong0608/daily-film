"use client";

import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Bell, Loader2 } from "lucide-react";
import { toggleFavorite, toggleFollow, getUserStats } from "@/app/actions/user";
import { cn } from "@/lib/utils";
import PlaylistPickerButton from "@/components/playlists/PlaylistPickerButton";

interface ActionButtonsProps {
  movieSlug: string;
}

export default function ActionButtons({
  movieSlug,
}: ActionButtonsProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchStats = async () => {
      const username = localStorage.getItem("username");
      if (username) {
        const stats = await getUserStats(username, movieSlug);
        setIsFavorite(stats.isFavorite);
        setIsFollowed(stats.isFollowed);
      }
      setIsLoading(false);
    };
    fetchStats();
  }, [movieSlug]);

  const handleFavorite = () => {
    const username = localStorage.getItem("username");
    if (!username) return; // Should potentially redirect or alert? Assuming Gate handles most.

    // Optimistic update
    const nextState = !isFavorite;
    setIsFavorite(nextState);

    startTransition(async () => {
      const result = await toggleFavorite(username, movieSlug);
      if (result.error) {
        // Revert on error
        setIsFavorite(!nextState);
      }
    });
  };

  const handleFollow = () => {
    const username = localStorage.getItem("username");
    if (!username) return;

    // Optimistic update
    const nextState = !isFollowed;
    setIsFollowed(nextState);

    startTransition(async () => {
      const result = await toggleFollow(username, movieSlug);
      if (result.error) {
        setIsFollowed(!nextState);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" disabled>
          <Loader2 className="h-4 w-4 animate-spin" />
        </Button>
        <Button variant="outline" size="sm" disabled>
          <Loader2 className="h-4 w-4 animate-spin" />
        </Button>
        <Button variant="outline" size="sm" disabled>
          <Loader2 className="h-4 w-4 animate-spin" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={isFavorite ? "secondary" : "outline"}
        size="sm"
        onClick={handleFavorite}
        disabled={isPending}
        className={cn(
          "gap-2 transition-colors",
          isFavorite && "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-500"
        )}
      >
        <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
        {isFavorite ? "Đã thích" : "Yêu thích"}
      </Button>

      <Button
        variant={isFollowed ? "secondary" : "outline"}
        size="sm"
        onClick={handleFollow}
        disabled={isPending}
        className={cn(
          "gap-2 transition-colors",
          isFollowed && "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/30 dark:text-blue-500"
        )}
      >
        <Bell className={cn("h-4 w-4", isFollowed && "fill-current")} />
        {isFollowed ? "Đang theo dõi" : "Theo dõi"}
      </Button>

      <PlaylistPickerButton movieSlug={movieSlug} />
    </div>
  );
}
