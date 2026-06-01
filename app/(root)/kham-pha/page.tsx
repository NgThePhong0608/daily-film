import Link from "next/link";
import { getTrendingMovies } from "@/app/actions/analytics";
import { getTopRatedMovies } from "@/app/actions/ratings";
import MovieCard from "@/components/movie/MovieCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  COUNTRY_LABELS,
  COUNTRY_SLUGS,
  MOVIE_CATEGORY_LABELS,
  MOVIE_CATEGORY_SLUGS,
  type CountrySlug,
  type MovieCategorySlug,
} from "@/lib/constants";

export const metadata = {
  title: "Khám phá phim - Daily Film",
  description:
    "Khám phá phim theo thể loại, quốc gia, xu hướng và đánh giá cao trên Daily Film.",
};

export default async function DiscoverPage() {
  const [trendingMovies, topRatedMovies] = await Promise.all([
    getTrendingMovies("day"),
    getTopRatedMovies(6),
  ]);

  return (
    <div className="container py-8">
      <section className="mb-10 rounded-3xl border bg-gradient-to-br from-card via-card to-muted/40 p-6 shadow-sm">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Discover
          </p>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Khám phá phim theo gu xem của bạn
          </h1>
          <p className="text-muted-foreground">
            Đi nhanh tới danh sách đang hot, phim được đánh giá cao, thể loại yêu
            thích và các quốc gia phổ biến.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild>
              <Link href="/#phim-moi-cap-nhat">Phim mới cập nhật</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/tim-kiem">Tìm kiếm ngay</Link>
            </Button>
          </div>
        </div>
      </section>

      {trendingMovies.length > 0 && (
        <section className="mb-10">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Đang thịnh hành</h2>
              <p className="text-sm text-muted-foreground">
                Các phim được xem nhiều nhất trong hệ thống hiện tại.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
            {trendingMovies.slice(0, 6).map((item) =>
              item.movieData ? (
                <MovieCard key={item.movieSlug} movie={item.movieData} />
              ) : null,
            )}
          </div>
        </section>
      )}

      {topRatedMovies.length > 0 && (
        <section className="mb-10">
          <div className="mb-5">
            <h2 className="text-2xl font-bold tracking-tight">Đánh giá cao</h2>
            <p className="text-sm text-muted-foreground">
              Những phim nổi bật theo điểm đánh giá của người dùng.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
            {topRatedMovies.map((item) =>
              item.movieData ? (
                <MovieCard key={item.movieSlug} movie={item.movieData} />
              ) : null,
            )}
          </div>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Khám phá theo thể loại</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {MOVIE_CATEGORY_SLUGS.map((slug) => (
              <Button key={slug} variant="outline" size="sm" asChild>
                <Link href={`/the-loai/${slug}`}>
                  {MOVIE_CATEGORY_LABELS[slug as MovieCategorySlug]}
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Khám phá theo quốc gia</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {COUNTRY_SLUGS.map((slug) => (
              <Button key={slug} variant="outline" size="sm" asChild>
                <Link href={`/quoc-gia/${slug}`}>
                  {COUNTRY_LABELS[slug as CountrySlug]}
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
