import { getTrendingMovies } from "@/app/actions/analytics";
import MovieCard from "@/components/movie/MovieCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Flame } from "lucide-react";

export default async function TrendingSection() {
  const trendingMovies = await getTrendingMovies('day');

  if (trendingMovies.length === 0) return null;

  return (
    <section className="py-8">
      <div className="flex items-center gap-2 mb-6">
        <Flame className="h-6 w-6 text-orange-500" />
        <h2 className="text-2xl font-bold tracking-tight">Thịnh hành hôm nay</h2>
      </div>

      <ScrollArea className="w-full whitespace-nowrap rounded-md border text-card-foreground shadow-sm">
        <div className="flex w-max space-x-4 p-4">
          {trendingMovies.map((item, index) => (
            <div key={item.movieSlug} className="relative w-[150px] sm:w-[180px]">
              {/* Rank Badge */}
              <div className="absolute top-2 left-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-orange-600 text-lg font-bold text-white shadow-md">
                {index + 1}
              </div>
              {item.movieData && <MovieCard movie={item.movieData} />}
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}
