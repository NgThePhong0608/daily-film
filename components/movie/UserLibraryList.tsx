"use client";

import { useEffect, useState } from "react";
import { getUserLibraryWithDetails } from "@/app/actions/user";
import MovieCard from "@/components/movie/MovieCard";
import { Loader2 } from "lucide-react";

import { Movie } from "@/types/movie";

interface UserLibraryListProps {
  type: "favorites" | "follows";
}

export default function UserLibraryList({ type }: UserLibraryListProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const user = localStorage.getItem("username");

    const fetchData = async () => {
      if (user) {
        const data = await getUserLibraryWithDetails(user);
        setMovies(type === "favorites" ? data.favorites : data.follows);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [type]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-20 bg-muted/30 rounded-lg">
        <p className="text-muted-foreground">Chưa có phim.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {movies.map((movie) => (
        <MovieCard key={movie._id} movie={movie} />
      ))}
    </div>
  );
}
