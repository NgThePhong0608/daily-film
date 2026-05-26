"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { ListPlus, Loader2, Plus } from "lucide-react";

import {
  createPlaylist,
  getPlaylistsForMovie,
  setMoviePlaylistMembership,
  type PlaylistMovieMembership,
} from "@/app/actions/playlists";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface PlaylistPickerButtonProps {
  movieSlug: string;
}

export default function PlaylistPickerButton({
  movieSlug,
}: PlaylistPickerButtonProps) {
  const [open, setOpen] = useState(false);
  const [playlists, setPlaylists] = useState<PlaylistMovieMembership[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    async function loadPlaylists() {
      const username = localStorage.getItem("username");
      if (!username) return;

      setIsLoading(true);
      setError("");

      const result = await getPlaylistsForMovie(username, movieSlug);

      if (!cancelled) {
        setPlaylists(result);
        setIsLoading(false);
      }
    }

    loadPlaylists();

    return () => {
      cancelled = true;
    };
  }, [movieSlug, open]);

  const handleCreatePlaylist = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const username = localStorage.getItem("username");
    if (!username) return;

    startTransition(async () => {
      setError("");
      const result = await createPlaylist(username, newPlaylistName);

      if (result.error || !result.playlist) {
        setError(result.error || "Không thể tạo playlist");
        return;
      }

      setPlaylists((current) => [
        { ...result.playlist, hasMovie: false },
        ...current,
      ]);
      setNewPlaylistName("");
    });
  };

  const handleTogglePlaylist = (
    playlist: PlaylistMovieMembership,
    shouldInclude: boolean,
  ) => {
    const username = localStorage.getItem("username");
    if (!username) return;

    setPlaylists((current) =>
      current.map((item) =>
        item.id === playlist.id ? { ...item, hasMovie: shouldInclude } : item,
      ),
    );

    startTransition(async () => {
      const result = await setMoviePlaylistMembership(
        username,
        playlist.id,
        movieSlug,
        shouldInclude,
      );

      if (result.error) {
        setError(result.error);
        setPlaylists((current) =>
          current.map((item) =>
            item.id === playlist.id
              ? { ...item, hasMovie: playlist.hasMovie }
              : item,
          ),
        );
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <ListPlus className="h-4 w-4" />
          Playlist
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm vào playlist</DialogTitle>
          <DialogDescription>
            Chọn playlist để lưu phim này.
          </DialogDescription>
        </DialogHeader>

        <form className="flex gap-2" onSubmit={handleCreatePlaylist}>
          <Input
            value={newPlaylistName}
            onChange={(event) => setNewPlaylistName(event.target.value)}
            placeholder="Tên playlist mới"
            maxLength={80}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isPending || newPlaylistName.trim().length === 0}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Tạo playlist</span>
          </Button>
        </form>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="max-h-[320px] space-y-2 overflow-y-auto pr-1">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : playlists.length === 0 ? (
            <div className="rounded-lg bg-muted/30 p-4 text-center text-sm text-muted-foreground">
              Chưa có playlist.
            </div>
          ) : (
            playlists.map((playlist) => (
              <label
                key={playlist.id}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border p-3 transition-colors hover:bg-accent"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">
                    {playlist.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {playlist.itemCount} phim
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={playlist.hasMovie}
                  disabled={isPending}
                  onChange={(event) =>
                    handleTogglePlaylist(playlist, event.target.checked)
                  }
                  className="h-4 w-4 accent-primary"
                />
              </label>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
