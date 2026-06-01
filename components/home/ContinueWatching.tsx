"use client";

import { useWatchHistory } from "@/hooks/use-watch-history";
import Link from "next/link";
import { resolveOphimImageUrl } from "@/lib/ophim";
import { PlayCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import RemoteImage from "@/components/shared/RemoteImage";

import { WatchHistoryItem } from "@/types/history";

interface Props {
  initialData?: WatchHistoryItem[];
}

export default function ContinueWatching({ initialData = [] }: Props) {
  const { history, isLoaded, removeFromHistory } = useWatchHistory();

  // Prefer client history if loaded (for optimistic updates), else server initialData
  const displayItems = isLoaded && history.length > 0 ? history : initialData;

  if (displayItems.length === 0) return null;

  return (
    <section className="py-8">
      <h2 className="mb-6 text-2xl font-bold tracking-tight">Tiếp tục xem</h2>
      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
        {displayItems.map((item) => {
          if (!item.posterUrl) return null;
          const posterUrl = resolveOphimImageUrl(item.posterUrl);

          return (
            <div key={item.movieSlug} className="relative group shrink-0 w-[160px]">
              <Link href={`/xem-phim/${item.movieSlug}/${item.episodeSlug}`}>
                <Card className="relative overflow-hidden border-none bg-transparent">
                  <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg">
                    <RemoteImage
                      src={posterUrl}
                      alt={item.movieTitle}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      sizes="160px"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <PlayCircle className="h-10 w-10 text-white" />
                    </div>

                    {/* Remove button */}
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeFromHistory(item.movieSlug);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="pt-2">
                    <h3 className="line-clamp-1 text-sm font-medium text-foreground group-hover:text-primary">
                      {item.movieTitle}
                    </h3>
                    <p className="line-clamp-1 text-xs text-muted-foreground">
                      Tập {item.episodeName}
                    </p>
                  </div>
                </Card>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
