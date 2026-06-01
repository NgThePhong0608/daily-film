import { getMovieDetail } from "@/lib/ophim";
import EpisodeList from "@/components/movie/EpisodeList";
import { notFound } from "next/navigation";
import { Metadata } from 'next';
import RelatedMovies from "@/components/movie/RelatedMovies";
import CustomPlayer from "@/components/movie/CustomPlayer";
import CommentSection from "@/components/comments/CommentSection";

interface Props {
  params: Promise<{ slug: string; episode: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const data = await getMovieDetail(params.slug);
  if (!data) return { title: 'Lỗi' };

  // Find current episode name
  let episodeName = params.episode;
  data.episodes.forEach(server => {
    const found = server.server_data.find(e => e.slug === params.episode);
    if (found) episodeName = found.name;
  });

  return {
    title: `Xem phim ${data.movie.name} - Tập ${episodeName}`,
    description: `Xem phim ${data.movie.name} tập ${episodeName} miễn phí chất lượng cao.`,
  };
}

export default async function WatchPage(props: Props) {
  const params = await props.params;
  const data = await getMovieDetail(params.slug);
  if (!data) return notFound();

  const { movie, episodes } = data;

  // Find the specific episode data from the FIRST server that has it, or any server.
  // Usually we prefer the first server or let user choose server. 
  // For simplicity, find the episode in the first server that contains it.

  let currentEpisode = null;
  let nextEpisodeSlug = undefined;

  // Flatten search or check servers
  for (const server of episodes) {
    const foundIndex = server.server_data.findIndex(e => e.slug === params.episode);
    if (foundIndex !== -1) {
      currentEpisode = server.server_data[foundIndex];
      // Check for next episode in the SAME server
      if (foundIndex + 1 < server.server_data.length) {
        nextEpisodeSlug = server.server_data[foundIndex + 1].slug;
      }
      break;
    }
  }

  if (!currentEpisode) return notFound();

  return (
    <div className="container py-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{movie.name}</h1>
            <p className="text-muted-foreground">Tập: {currentEpisode.name}</p>
          </div>

          <CustomPlayer
            hlsUrl={currentEpisode.link_m3u8}
            embedUrl={currentEpisode.link_embed}
            movieSlug={movie.slug}
            movieTitle={movie.name}
            posterUrl={movie.poster_url}
            episodeSlug={params.episode}
            episodeName={currentEpisode.name}
            nextEpisodeSlug={nextEpisodeSlug}
          />

          <div className="bg-muted/30 p-4 rounded-lg">
            <h2 className="font-semibold mb-2">Thông tin phim</h2>
            <p className="text-sm text-muted-foreground">
              {movie.content?.replace(/<[^>]+>/g, '') || ''}
            </p>
          </div>

          <div className="lg:hidden">
            <h3 className="font-semibold leading-none tracking-tight mb-4">Danh sách tập</h3>
            <div className="max-h-48 overflow-y-auto pr-2">
              <EpisodeList
                episodes={episodes}
                currentEpisodeSlug={params.episode}
                movieSlug={movie.slug}
              />
            </div>

            <CommentSection movieSlug={movie.slug} />
          </div>

          <RelatedMovies movie={movie} />
        </div>

        <div className="space-y-6 hidden lg:block">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <h3 className="font-semibold leading-none tracking-tight mb-4">Danh sách tập</h3>
              <div className="max-h-48 overflow-y-auto pr-2">
                <EpisodeList
                  episodes={episodes}
                  currentEpisodeSlug={params.episode}
                  movieSlug={movie.slug}
                />
              </div>
            </div>
          </div>

          <CommentSection movieSlug={movie.slug} />
        </div>
      </div>
    </div>
  );
}
