import { Metadata } from "next";

import PlaylistDetailClient from "@/components/playlists/PlaylistDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Playlist - Daily Film",
  description: "Danh sách phim trong playlist của bạn",
};

export default async function PlaylistDetailPage(props: Props) {
  const params = await props.params;

  return (
    <div className="container py-8">
      <PlaylistDetailClient playlistId={params.id} />
    </div>
  );
}
