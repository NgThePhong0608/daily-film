import { getTopRatedMovies } from "@/app/actions/ratings";
import Link from "next/link";
import { resolveMovieImageUrl } from "@/lib/movie-api";
import { Star } from "lucide-react";
import RemoteImage from "@/components/shared/RemoteImage";

export default async function TopRatedSection() {
  const topMovies = await getTopRatedMovies(10);

  if (topMovies.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Top Đánh Giá Cao</h2>
        </div>
      </div>

      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide snap-x">
          {topMovies.map((item) => (
            <Link
              key={item.movieSlug}
              href={`/phim/${item.movieSlug}`}
              className="flex-none w-[160px] md:w-[200px] group snap-start"
            >
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-muted mb-3">
                <RemoteImage
                  src={resolveMovieImageUrl(
                    item.movieData.thumb_url || item.movieData.poster_url,
                  )}
                  alt={item.movieData.name}
                  fill
                  quality={90}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 160px, 200px"
                  loading="lazy"
                />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-bold text-white">
                    {item.average.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                  {item.movieData.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {item.movieData.year} • {item.total} đánh giá
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
