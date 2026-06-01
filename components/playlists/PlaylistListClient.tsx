"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Edit2, Loader2, Plus, Trash2 } from "lucide-react";

import {
  createPlaylist,
  deletePlaylist,
  getUserPlaylists,
  renamePlaylist,
  type PlaylistSummary,
} from "@/app/actions/playlists";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function PlaylistListClient() {
  const [playlists, setPlaylists] = useState<PlaylistSummary[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;

    async function loadPlaylists() {
      const username = localStorage.getItem("username");
      if (!username) {
        setIsLoading(false);
        return;
      }

      const result = await getUserPlaylists(username);

      if (!cancelled) {
        setPlaylists(result);
        setIsLoading(false);
      }
    }

    loadPlaylists();

    return () => {
      cancelled = true;
    };
  }, []);

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

      setPlaylists((current) => [result.playlist, ...current]);
      setNewPlaylistName("");
    });
  };

  const handleRenamePlaylist = (
    event: FormEvent<HTMLFormElement>,
    playlist: PlaylistSummary,
  ) => {
    event.preventDefault();

    const username = localStorage.getItem("username");
    if (!username) return;

    startTransition(async () => {
      setError("");
      const result = await renamePlaylist(username, playlist.id, editingName);

      if (result.error || !result.name) {
        setError(result.error || "Không thể đổi tên playlist");
        return;
      }

      setPlaylists((current) =>
        current.map((item) =>
          item.id === playlist.id
            ? { ...item, name: result.name, updatedAt: result.updatedAt || Date.now() }
            : item,
        ),
      );
      setEditingId(null);
      setEditingName("");
    });
  };

  const handleDeletePlaylist = (playlist: PlaylistSummary) => {
    const username = localStorage.getItem("username");
    if (!username) return;

    const shouldDelete = window.confirm(`Xoá playlist "${playlist.name}"?`);
    if (!shouldDelete) return;

    startTransition(async () => {
      setError("");
      const result = await deletePlaylist(username, playlist.id);

      if (result.error) {
        setError(result.error);
        return;
      }

      setPlaylists((current) =>
        current.filter((item) => item.id !== playlist.id),
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

  return (
    <div className="space-y-6">
      <form
        className="flex max-w-xl flex-col gap-2 sm:flex-row"
        onSubmit={handleCreatePlaylist}
      >
        <Input
          value={newPlaylistName}
          onChange={(event) => setNewPlaylistName(event.target.value)}
          placeholder="Tạo playlist mới"
          maxLength={80}
        />
        <Button
          type="submit"
          disabled={isPending || newPlaylistName.trim().length === 0}
          className="sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Tạo
        </Button>
      </form>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {playlists.length === 0 ? (
        <div className="rounded-lg bg-muted/30 py-20 text-center">
          <p className="text-muted-foreground">Chưa có playlist.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {playlists.map((playlist) => (
            <Card key={playlist.id} className="rounded-lg">
              <CardHeader>
                {editingId === playlist.id ? (
                  <form
                    className="flex gap-2"
                    onSubmit={(event) =>
                      handleRenamePlaylist(event, playlist)
                    }
                  >
                    <Input
                      value={editingName}
                      onChange={(event) => setEditingName(event.target.value)}
                      maxLength={80}
                    />
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isPending || editingName.trim().length === 0}
                    >
                      Lưu
                    </Button>
                  </form>
                ) : (
                  <Link href={`/playlists/${playlist.id}`}>
                    <CardTitle className="line-clamp-1 hover:text-primary">
                      {playlist.name}
                    </CardTitle>
                  </Link>
                )}
                <CardDescription>{playlist.itemCount} phim</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  onClick={() => {
                    setEditingId(playlist.id);
                    setEditingName(playlist.name);
                  }}
                  disabled={isPending}
                >
                  <Edit2 className="h-4 w-4" />
                  <span className="sr-only">Đổi tên</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  onClick={() => handleDeletePlaylist(playlist)}
                  disabled={isPending}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Xoá playlist</span>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
