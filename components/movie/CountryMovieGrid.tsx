"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Movie } from "@/types/movie";
import MovieCard from "./MovieCard";
import { fetchMoreMoviesByCountry } from "@/app/actions/movies";
import { Loader2 } from "lucide-react";

interface CountryMovieGridProps {
  initialMovies: Movie[];
  countrySlug: string;
  title?: string;
  initialPage?: number;
}

export default function CountryMovieGrid({
  initialMovies,
  countrySlug,
  title,
  initialPage = 1,
}: CountryMovieGridProps) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const loadingRef = useRef<HTMLDivElement>(null);

  // Keep track of loaded IDs to prevent duplicates
  const loadedIds = useRef(new Set(initialMovies.map((m) => m._id)));

  const loadNextPage = useCallback(async () => {
    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const res = await fetchMoreMoviesByCountry(countrySlug, nextPage);

      if (res.items.length > 0) {
        // Filter out duplicates
        const newMovies = res.items.filter((m) => {
          if (loadedIds.current.has(m._id)) return false;
          loadedIds.current.add(m._id);
          return true;
        });

        if (newMovies.length > 0) {
          setMovies((prev) => [...prev, ...newMovies]);
        }

        setPage(nextPage);

        if (!res.hasMore) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more movies", error);
    } finally {
      setIsLoading(false);
    }
  }, [countrySlug, page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoading) {
          loadNextPage();
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      },
    );

    const currentTarget = loadingRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [hasMore, isLoading, loadNextPage]);

  return (
    <section className="py-8">
      {title && (
        <h2 className="mb-6 text-2xl font-bold tracking-tight">{title}</h2>
      )}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {movies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>

      {hasMore && (
        <div ref={loadingRef} className="flex justify-center py-8 w-full">
          {isLoading ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : (
            <div className="h-8 w-full" />
          )}
        </div>
      )}
    </section>
  );
}
