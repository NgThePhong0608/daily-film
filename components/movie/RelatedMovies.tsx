import { getMoviesByCategory } from "@/lib/ophim";
import MovieGrid from "@/components/movie/MovieGrid";
import { MovieDetail } from "@/types/movie";

interface Props {
  movie: MovieDetail;
  limit?: number;
}

export default async function RelatedMovies({ movie, limit = 8 }: Props) {
  // Get first category slug
  const categorySlug = movie.category?.[0]?.slug;

  if (!categorySlug) return null;

  const { items } = await getMoviesByCategory(categorySlug, 1);

  // Filter out current movie and limit
  const related = items
    .filter((item) => item.slug !== movie.slug)
    .slice(0, limit);

  if (related.length === 0) return null;

  return (
    <section className="mt-12 space-y-4">
      <MovieGrid movies={related} title="Phim liên quan" />
    </section>
  );
}
