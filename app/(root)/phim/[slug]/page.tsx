import { getMovieDetail, resolveOphimImageUrl } from "@/lib/ophim";
import { notFound } from "next/navigation";
import Link from "next/link";
import EpisodeList from "@/components/movie/EpisodeList";
import JsonLd from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import RelatedMovies from "@/components/movie/RelatedMovies";
import ActionButtons from "@/components/movie/ActionButtons";
import { Metadata } from 'next';
import CommentSection from "@/components/comments/CommentSection";
import MovieRating from "@/components/movie/MovieRating";
import RemoteImage from "@/components/shared/RemoteImage";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const data = await getMovieDetail(params.slug);
  if (!data) return { title: 'Không tìm thấy phim' };

  return {
    title: `${data.movie.name} - Daily Film`,
    description: data.movie.content.slice(0, 160),
    openGraph: {
      images: [resolveOphimImageUrl(data.movie.poster_url)],
    },
  };
}

export default async function MovieDetailPage(props: Props) {
  const params = await props.params;
  const data = await getMovieDetail(params.slug);

  if (!data) return notFound();

  const { movie, episodes } = data;

  // Clean content HTML potentially
  const content = movie.content.replace(/<p>&nbsp;<\/p>/g, '');


  const posterUrl = resolveOphimImageUrl(movie.poster_url);
  const thumbUrl = resolveOphimImageUrl(movie.thumb_url);

  return (
    <div className="min-h-screen pb-12">
      <JsonLd movie={movie} />
      {/* Backdrop */}
      <div className="relative h-[40vh] w-full overflow-hidden md:h-[50vh]">
        <RemoteImage
          src={posterUrl}
          alt={`${movie.name} backdrop`}
          fill
          priority
          sizes="100vw"
          className="scale-105 object-cover blur-sm"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      <div className="container relative z-10 -mt-32 md:-mt-48">
        <div className="grid gap-8 md:grid-cols-[300px_1fr]">
          {/* Poster */}
          <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl shadow-2xl">
            <RemoteImage
              src={thumbUrl}
              alt={movie.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 300px"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4 text-white">
            <h1 className="text-3xl font-bold md:text-5xl">{movie.name}</h1>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl text-white/80">{movie.origin_name} ({movie.year})</h2>
              </div>
              <ActionButtons
                movieSlug={movie.slug}
              />
            </div>

            <MovieRating movieSlug={movie.slug} />

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
                {movie.quality}
              </Badge>
              <Badge variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
                {movie.lang}
              </Badge>
              {movie.country?.map(c => (
                <Link key={c.id} href={`/quoc-gia/${c.slug}`}>
                  <Badge variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20 cursor-pointer">
                    {c.name}
                  </Badge>
                </Link>
              ))}
              {movie.category?.map(c => (
                <Link key={c.id} href={`/the-loai/${c.slug}`}>
                  <Badge variant="secondary" className="hover:bg-secondary/80 cursor-pointer">
                    {c.name}
                  </Badge>
                </Link>
              ))}
            </div>

            <div
              className="prose prose-invert max-w-none text-gray-300"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            <div className="grid gap-4 py-4 sm:grid-cols-2">
              <div>
                <span className="text-muted-foreground">Đạo diễn:</span>
                <p>{movie.director?.join(', ') || 'N/A'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Diễn viên:</span>
                <p>{movie.actor?.join(', ') || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Episodes */}
        <div className="mt-12">
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <h3 className="mb-4 text-xl font-bold">Danh sách tập</h3>
              <div className="max-h-48 overflow-y-auto pr-2">
                <EpisodeList episodes={episodes} movieSlug={movie.slug} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comments */}
        <CommentSection movieSlug={movie.slug} />

        {/* Related Movies */}
        <RelatedMovies movie={movie} />
      </div>
    </div>
  );
}
