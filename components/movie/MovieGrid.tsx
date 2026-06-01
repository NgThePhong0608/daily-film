import { Movie } from "@/types/movie";
import MovieCard from "./MovieCard";

interface MovieGridProps {
  movies: Movie[];
  title?: string;
  id?: string;
}

export default function MovieGrid({ movies, title, id }: MovieGridProps) {
  return (
    <section id={id} className="py-8">
      {title && <h2 className="mb-6 text-2xl font-bold tracking-tight">{title}</h2>}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {movies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
