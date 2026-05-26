"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";

import {
  getPlaylistWithMovies,
  setMoviePlaylistMembership,
  type PlaylistSummary,
} from "@/app/actions/playlists";
import MovieCard from "@/components/movie/MovieCard";
import { Button } from "@/components/ui/button";
import { Movie } from "@/types/movie";

interface PlaylistDetailClientProps {
  playlistId: string;
}

export default function PlaylistDetailClient({
  playlistId,
}: PlaylistDetailClientProps) {
  const [playlist, setPlaylist] = useState<PlaylistSummary | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;

    async function loadPlaylist() {
      const username = localStorage.getItem("username");
      if (!username) {
        setIsLoading(false);
        return;
      }

      const result = await getPlaylistWithMovies(username, playlistId);

      if (!cancelled) {
        setPlaylist(result.playlist);
        setMovies(result.movies);
        setIsLoading(false);
      }
    }

    loadPlaylist();

    return () => {
      cancelled = true;
    };
  }, [playlistId]);

  const handleRemoveMovie = (movieSlug: string) => {
    const username = localStorage.getItem("username");
    if (!username || !playlist) return;

    startTransition(async () => {
      setError("");
      const result = await setMoviePlaylistMembership(
        username,
        playlist.id,
        movieSlug,
        false,
      );

      if (result.error) {
        setError(result.error);
        return;
      }

      setMovies((current) =>
        current.filter((movie) => movie.slug !== movieSlug),
      );
      setPlaylist((current) =>
        current
          ? { ...current, itemCount: Math.max(0, current.itemCount - 1) }
          : current,
      );
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="space-y-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/playlists">
            <ArrowLeft className="h-4 w-4" />
            Playlist
          </Link>
        </Button>
        <div className="rounded-lg bg-muted/30 py-20 text-center">
          <p className="text-muted-foreground">Không tìm thấy playlist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/playlists">
            <ArrowLeft className="h-4 w-4" />
            Playlist
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{playlist.name}</h1>
          <p className="text-sm text-muted-foreground">
            {playlist.itemCount} phim
          </p>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {movies.length === 0 ? (
        <div className="rounded-lg bg-muted/30 py-20 text-center">
          <p className="text-muted-foreground">
            Chưa có phim trong playlist này.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {movies.map((movie) => (
            <div key={movie._id} className="space-y-2">
              <MovieCard movie={movie} />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full"
                disabled={isPending}
                onClick={() => handleRemoveMovie(movie.slug)}
              >
                <Trash2 className="h-4 w-4" />
                Xoá
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
