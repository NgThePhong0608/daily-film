import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayCircle } from "lucide-react";
import { Movie } from "@/types/movie";
import { resolveOphimImageUrl } from "@/lib/ophim";
import RemoteImage from "@/components/shared/RemoteImage";


interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const thumbUrl = resolveOphimImageUrl(movie.thumb_url);

  return (
    <Link href={`/phim/${movie.slug}`}>
      <Card className="group relative overflow-hidden border-none bg-transparent transition-all hover:scale-105 rounded-lg">
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg">
          <RemoteImage
            src={thumbUrl}
            alt={movie.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
            loading="lazy"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <PlayCircle className="h-12 w-12 text-white" />
          </div>
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-black/60 text-white hover:bg-black/80">
              {movie.year}
            </Badge>
          </div>
        </div>
        <div className="pt-2">
          <h3 className="line-clamp-1 text-sm font-medium text-foreground group-hover:text-primary">
            {movie.name}
          </h3>
          <p className="line-clamp-1 text-xs text-muted-foreground">
            {movie.origin_name}
          </p>
        </div>
      </Card>
    </Link>
  );
}
