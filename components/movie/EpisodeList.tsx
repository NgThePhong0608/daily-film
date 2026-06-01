import Link from "next/link";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import { Episode } from "@/types/movie";

interface EpisodeListProps {
  episodes: Episode[];

  currentEpisodeSlug?: string;
  movieSlug: string;
}

export default function EpisodeList({ episodes, currentEpisodeSlug, movieSlug }: EpisodeListProps) {
  if (!episodes || episodes.length === 0) return <div>Chưa có tập phim nào.</div>;

  return (
    <div className="space-y-6">
      {episodes.map((server, idx) => (
        <div key={idx} className="space-y-3">
          <h3 className="font-semibold text-muted-foreground">{server.server_name}</h3>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {server.server_data.map((ep) => (
              <Link
                key={ep.slug}
                href={`/xem-phim/${movieSlug}/${ep.slug}`}
                className="w-full"
              >
                <Button
                  variant={currentEpisodeSlug === ep.slug ? "default" : "secondary"}
                  className={cn(
                    "w-full px-2 text-xs h-9 truncate",
                    currentEpisodeSlug === ep.slug && "pointer-events-none"
                  )}
                  title={ep.name}
                >
                  {ep.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
