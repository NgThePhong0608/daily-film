import Image from "next/image";
import Link from "next/link";
import { getActors, resolveMovieImageUrl } from "@/lib/movie-api";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Diễn viên - Daily Film",
  description: "Danh sách diễn viên trên Daily Film.",
};

export default async function ActorsPage() {
  const actors = await getActors(120);

  return (
    <div className="container py-8">
      <h1 className="mb-6 text-2xl font-bold">Diễn viên</h1>

      {actors.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          {actors.map((actor) => (
            <Link
              key={actor.id || actor.slug}
              href={`/tim-kiem?keyword=${encodeURIComponent(actor.name)}`}
              className="group overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-colors hover:border-primary"
            >
              <div className="relative aspect-[2/3] bg-muted">
                <Image
                  src={resolveMovieImageUrl(actor.thumb_url)}
                  alt={actor.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 12vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <h2 className="line-clamp-2 text-sm font-medium">{actor.name}</h2>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">Không tải được danh sách diễn viên.</p>
      )}
    </div>
  );
}
