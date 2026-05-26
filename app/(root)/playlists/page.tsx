import { ListPlus } from "lucide-react";
import { Metadata } from "next";

import PlaylistListClient from "@/components/playlists/PlaylistListClient";

export const metadata: Metadata = {
  title: "Playlist - Daily Film",
  description: "Danh sách playlist phim của bạn",
};

export default function PlaylistsPage() {
  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center gap-2">
        <ListPlus className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Playlist</h1>
      </div>

      <PlaylistListClient />
    </div>
  );
}
